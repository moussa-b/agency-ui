import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Tag } from 'primeng/tag';
import { User } from '../entities/user.entity';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsersService } from '../users.service';
import { DialogService } from 'primeng/dynamicdialog';
import { UserFormComponent } from '../user-form/user-form.component';
import { Card } from 'primeng/card';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { Toast } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { InputText } from 'primeng/inputtext';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-user-list',
  imports: [
    TableModule,
    ConfirmPopupModule,
    Button,
    IconField,
    InputIcon,
    Tag,
    Card,
    TranslatePipe,
    NgIf,
    Toast,
    InputText
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  providers: [ConfirmationService, UsersService, DialogService, MessageService],
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  cols!: Column[];

  constructor(private dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private usersService: UsersService,
              private translate: TranslateService,
              private messageService: MessageService,) {
  }

  ngOnInit(): void {
    this.findAllUsers();
  }

  private findAllUsers(): void {
    this.usersService.findAll().subscribe((users: User[]) => {
      this.users = users || [];
    });
  }

  openNew(): void {
    this.dialogService.open(UserFormComponent, {
      header: this.translate.instant('users.add_user'),
      closable: true,
      modal: true,
    }).onClose.subscribe((user: User) => {
      if (user) {
        this.findAllUsers();
      }
    });
  }

  editUser(user: User) {
    this.dialogService.open(UserFormComponent, {
      data: {user: user},
      header: this.translate.instant('users.add_user'),
      closable: true,
      modal: true,
    }).onClose.subscribe((user: User) => {
      if (user) {
        this.findAllUsers();
      }
    });
  }

  deleteUser(userId: number, event: MouseEvent) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.translate.instant('users.delete_user_confirmation_message'),
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: this.translate.instant('common.cancel'),
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: this.translate.instant('common.delete'),
        severity: 'danger'
      },
      accept: () => {
        this.usersService.remove(userId).subscribe((result: boolean) => {
          if (result) {
            this.messageService.add({
              severity: 'success',
              summary: this.translate.instant('common.success'),
              detail: this.translate.instant('common.success_message')
            });
            this.users = this.users.filter((u: User) => u.id !== userId);
          }
        });
      }
    });
  }
}
