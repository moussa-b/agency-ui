import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  imports: [
    Button,
    FormsModule,
    InputText,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './password-reset.component.html',
})
export class PasswordResetComponent {

  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form Data:', form.value);
    }
  }
}
