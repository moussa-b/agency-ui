import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    NgIf,
    TranslatePipe,
    RouterLink,
    Avatar,
    Menu
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  menuItems: MenuItem[] = [];

  constructor(private authService: AuthService,
              private translateService: TranslateService,
              private router: Router,) {
  }

  ngOnInit() {
    this.buildMenuItems();
  }

  private buildMenuItems() {
    this.menuItems = [
      {
        label: this.translateService.instant('header.change_language'),
        items: [
          {
            label: this.translateService.instant('header.french'),
            icon: 'pi pi-flag',
            command: () => this.changeLanguage('fr')
          },
          {
            label: this.translateService.instant('header.english'),
            icon: 'pi pi-flag',
            command: () => this.changeLanguage('en')
          }
        ]
      },
      {
        label: this.translateService.instant('header.profile'),
        items: [
          {
            label: this.translateService.instant('header.my_account'),
            icon: 'pi pi-user',
            command: () => this.goToProfile()
          },
          {label: this.translateService.instant('header.logout'), icon: 'pi pi-sign-out', command: () => this.logout()}
        ]
      }
    ];
  }

  private changeLanguage(language: string) {
    this.translateService.use(language).subscribe(() => {
      this.buildMenuItems();
    });
  }

  private goToProfile() {
    this.router.navigateByUrl('/my-account');
  }

  private logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login', {info: {message: {severity: 'info', message: this.translateService.instant('auth.logout_confirmation_message')}}});
  }
}
