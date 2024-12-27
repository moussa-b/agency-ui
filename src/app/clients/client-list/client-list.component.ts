import { Component, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthService } from '../../core/services/auth.service';
import { Client } from '../entities/client.entity';
import { ClientsService } from '../clients.service';
import { ClientFormComponent } from '../client-form/client-form.component';

@Component({
  selector: 'app-client-list',
  imports: [
    Button,
    Card,
    IconField,
    InputIcon,
    InputText,
    NgIf,
    PrimeTemplate,
    TableModule,
    Toast,
    TranslatePipe
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
  providers: [DialogService, ConfirmationService, MessageService]
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  isManagerOrAdmin = false;

  constructor(private dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private clientsService: ClientsService,
              private translateService: TranslateService,
              private authService: AuthService,
              private messageService: MessageService,) {
  }

  ngOnInit(): void {
    this.findAllClients();
    this.isManagerOrAdmin = this.authService.isManager || this.authService.isAdmin;
  }

  private findAllClients(): void {
    this.clientsService.findAll().subscribe((clients: Client[]) => {
      this.clients = clients || [];
    });
  }

  openNew(): void {
    this.dialogService.open(ClientFormComponent, {
      header: this.translateService.instant('clients.add_client'),
      closable: true,
      modal: true,
    }).onClose.subscribe((client: Client) => {
      if (client) {
        this.findAllClients();
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('common.success'),
          detail: this.translateService.instant('common.success_message')
        });
      }
    });
  }

  editClient(client: Client) {
    this.dialogService.open(ClientFormComponent, {
      data: {client: client},
      header: this.translateService.instant('clients.add_client'),
      closable: true,
      modal: true,
    }).onClose.subscribe((client: Client) => {
      if (client) {
        this.findAllClients();
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('common.success'),
          detail: this.translateService.instant('common.success_message')
        });
      }
    });
  }

  deleteClient(clientId: number, event: MouseEvent) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.translateService.instant('clients.delete_client_confirmation_message'),
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: this.translateService.instant('common.cancel'),
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: this.translateService.instant('common.delete'),
        severity: 'danger'
      },
      accept: () => {
        this.clientsService.remove(clientId).subscribe((result: boolean) => {
          if (result) {
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('common.success'),
              detail: this.translateService.instant('common.success_message')
            });
            this.clients = this.clients.filter((u: Client) => u.id !== clientId);
          }
        });
      }
    });
  }
}
