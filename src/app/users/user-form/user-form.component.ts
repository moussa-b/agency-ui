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
              private messageService: MessageService,) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [UserRole.USER],
    });
    this.roleOptions= [
      { label: this.translate.instant('users.administrator'), value: UserRole.ADMIN },
      { label: this.translate.instant('users.manager'), value: UserRole.MANAGER },
      { label: this.translate.instant('users.standard_user'), value: UserRole.USER },
    ];
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.usersService.create(this.userForm.getRawValue()).subscribe((user: User) => {
        if (user && user.id! > 0) {
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('success'),
            detail: this.translate.instant('success_message')
          });
        }
      });
    }
  }

}
