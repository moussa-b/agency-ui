import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Tag } from 'primeng/tag';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { User } from '../entities/user.entity';
import { ConfirmationService } from 'primeng/api';
import { UsersService } from '../users.service';
import { DialogService } from 'primeng/dynamicdialog';
import { UserFormComponent } from '../user-form/user-form.component';
import { InputText } from 'primeng/inputtext';
import { Card } from 'primeng/card';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgIf } from '@angular/common';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-user-list',
  imports: [
    TableModule,
    Button,
    IconField,
    InputIcon,
    Tag,
    ConfirmDialog,
    InputText,
    Card,
    TranslatePipe,
    NgIf
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  providers: [ConfirmationService, UsersService, DialogService],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  cols!: Column[];

  constructor(private readonly dialogService: DialogService,
              private readonly usersService: UsersService,
              private readonly translate: TranslateService,) {
  }

  ngOnInit(): void {
    this.usersService.findAll().subscribe((users: User[]) => {
      this.users = users || [];
    });
  }

  openNew(): void {
    this.dialogService.open(UserFormComponent, {
      header: this.translate.instant('users.add_user'),
      closable: true,
      modal: true,
    });
  }

  editUser(user: User) {

  }

  deleteUser(user: User) {

  }
}
