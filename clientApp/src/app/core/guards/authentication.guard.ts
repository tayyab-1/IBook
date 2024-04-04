import { Injectable } from '@angular/core';
import { CanActivate, Router, } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  constructor(
    private router: Router,
    private cookie: CookieService
  ) { }

  canActivate() {
    // for MVP, its just simply checks on the stored cookie, but it can be enhanced later with more edge cases
    if (!this.cookie.get('loggedIn')) {
      this.router.navigateByUrl('');
      return false;
    }
    return true;
  }
}
