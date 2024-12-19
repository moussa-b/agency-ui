import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Password } from 'primeng/password';
import { InputText } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';

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
  rememberMe?: boolean;
  password?: string;

  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form Data:', form.value);
    }
  }
}
