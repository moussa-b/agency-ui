import { Component, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { SelectButton } from 'primeng/selectbutton';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api';
import { Sex } from '../../core/models/sex.enum';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClientsService } from '../clients.service';
import { Client } from '../entities/client.entity';
import { Textarea } from 'primeng/textarea';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    Button,
    FormsModule,
    InputText,
    NgIf,
    ReactiveFormsModule,
    SelectButton,
    TranslatePipe,
    Textarea
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent implements OnInit {
  clientForm!: FormGroup;
  sexOptions!: SelectItem<Sex>[];

  constructor(private fb: FormBuilder,
              private translateService: TranslateService,
              private clientsService: ClientsService,
              private dialogRef: DynamicDialogRef,
              private dialogConfig: DynamicDialogConfig) {}

  ngOnInit(): void {
    const client: Client | undefined = this.dialogConfig.data?.client;
    this.clientForm = this.fb.group({
      id: [client?.id],
      lastName: [client?.lastName, Validators.required],
      firstName: [client?.firstName, Validators.required],
      email: [client?.email, [Validators.required, Validators.email]],
      phone: [client?.phone],
      sex: [client?.sex || Sex.MALE],
      address: [client?.address],
    });
    this.sexOptions= [
      { label: this.translateService.instant('common.man'), value: Sex.MALE },
      { label: this.translateService.instant('common.woman'), value: Sex.FEMALE },
    ];
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      let clientFormValue = this.clientForm.getRawValue();
      const observable = clientFormValue.id > 0 ? this.clientsService.update(clientFormValue.id, clientFormValue) : this.clientsService.create(clientFormValue);
      observable.subscribe((client: Client) => {
        if (client && client.id! > 0) {
          this.dialogRef.close(client);
        }
      });
    }
  }

}
