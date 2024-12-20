import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { User, UserRole } from '../entities/user.entity';
import { MessageService, SelectItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { UsersService } from '../users.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    FormsModule,
    InputText,
    TranslatePipe,
    ReactiveFormsModule,
    DropdownModule,
    NgIf,
    Button,
    Toast
  ],
  templateUrl: './user-form.component.html',
  providers: [MessageService]
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  roleOptions!: SelectItem<UserRole>[];

  constructor(private fb: FormBuilder,
              private translate: TranslateService,
              private usersService: UsersService,
              private messageService: MessageService,
              private dialogRef: DynamicDialogRef,
              private dialogConfig: DynamicDialogConfig) {}

  ngOnInit(): void {
    const user: User | undefined = this.dialogConfig.data.user;
    this.userForm = this.fb.group({
      id: [user?.id],
      lastName: [user?.lastName, Validators.required],
      firstName: [user?.firstName, Validators.required],
      email: [user?.email, [Validators.required, Validators.email]],
      role: [user?.role || UserRole.USER],
    });
    this.roleOptions= [
      { label: this.translate.instant('users.administrator'), value: UserRole.ADMIN },
      { label: this.translate.instant('users.manager'), value: UserRole.MANAGER },
      { label: this.translate.instant('users.standard_user'), value: UserRole.USER },
    ];
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      let userFormValue = this.userForm.getRawValue();
      const observable = userFormValue.id > 0 ? this.usersService.update(userFormValue.id, userFormValue) : this.usersService.create(userFormValue);
      observable.subscribe((user: User) => {
        if (user && user.id! > 0) {
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('common.success'),
            detail: this.translate.instant('common.success_message')
          });
          this.dialogRef.close(user);
        }
      });
    }
  }

}
