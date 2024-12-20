import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { alreadyConnectedGuard } from './core/guards/already-connected.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [alreadyConnectedGuard]
  },
  {
    path: 'password-reset',
    loadComponent: () => import('./auth/password-reset/password-reset.component').then(m => m.PasswordResetComponent),
    canActivate: [alreadyConnectedGuard]
  },
  {
    path: '',
    loadComponent: () => import('./core/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children : [
      { path: 'users', loadComponent: () => import('./users/user-list/user-list.component').then(m => m.UserListComponent) },
      { path: 'clients', loadComponent: () => import('./clients/client-list/client-list.component').then(m => m.ClientListComponent) },
      { path: 'my-account', loadComponent: () => import('./users/my-account/my-account.component').then(m => m.MyAccountComponent) },
      { path: '**', loadComponent: () => import('./users/user-list/user-list.component').then(m => m.UserListComponent) },
    ]
  }
];
