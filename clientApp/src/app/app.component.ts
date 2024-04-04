import { Component } from '@angular/core';
import { AuthenticationService } from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WriteBook';

  constructor(private authenticationService : AuthenticationService) {
    this.authenticationService.checkUser();
  }
}
