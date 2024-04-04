import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  loggedIn: boolean = false
  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit(): void {

    this.auth.loggedIn$.subscribe((isLoggedIn: boolean) => {
      this.loggedIn = isLoggedIn;
    })
  }

  getStartedHandler(): void {
    if (this.loggedIn) {
      this.router.navigate(['/documents'])
    } else {
      this.router.navigate(['/login'])
    }
  }

}
