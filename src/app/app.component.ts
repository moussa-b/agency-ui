import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private translateService: TranslateService) {
    this.translateService.addLangs(['fr', 'en']);
    this.translateService.setDefaultLang('fr');
    this.translateService.use('fr');
  }
}
