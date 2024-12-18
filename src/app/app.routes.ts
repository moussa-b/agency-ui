import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'password-reset', loadComponent: () => import('./auth/password-reset/password-reset.component').then(m => m.PasswordResetComponent) },
  {
    path: '',
    loadComponent: () => import('./core/main/main.component').then(m => m.MainComponent),
    children : [
      { path: 'users', loadComponent: () => import('./users/user-list/user-list.component').then(m => m.UserListComponent) },
      { path: 'clients', loadComponent: () => import('./clients/client-list/client-list.component').then(m => m.ClientListComponent) },
      { path: '**', loadComponent: () => import('./users/user-list/user-list.component').then(m => m.UserListComponent) },
    ]
  }
];
