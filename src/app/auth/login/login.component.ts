import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Password } from 'primeng/password';
import { InputText } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    TranslatePipe,
    Password,
    InputText,
    Checkbox,
    Button,
    RouterLink
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  rememberMe = false;
  password?: string;
  username?: string;

  constructor(private authService: AuthService, private router: Router,) {
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.authService.login(this.username!, this.password!, this.rememberMe).subscribe((response: { access_token: string }) => {
        if (response?.access_token && response.access_token?.length > 0) {
          this.router.navigateByUrl('');
        }
      })
    }
  }
}
