import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IPerson } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  server: string = environment.apiURL;
  loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userData$: BehaviorSubject<IPerson> = new BehaviorSubject<IPerson>({
    username: "",
    first_name: "",
    last_name: ""
  });

  constructor(
    private cookie: CookieService,
    private http: HttpClient
  ) {
    this.checkUser();
  }

  // Service that calls api to register user
  register(apiPayload: { username: string, password: string, first_name: string, last_name: string }) {
    return this.http.post(this.server + '/api/auth/register/', apiPayload)
      .pipe(
        tap({
          next: _ => {
            this.cookie.set('loggedIn', `true`);
            this.login({ username: apiPayload.username, password: apiPayload.password }).subscribe({
              error: (loginError) => {
                console.error(loginError);
              }
            });
          },
          error: (error) => {
            console.error(error);
          }
        })
      );
  }

  // updates the states of whether a profile is logged in or not based on cookies token
  async checkUser() {
    if (this.cookie.get('accessToken')) {
      try {
        const res: any = await firstValueFrom(this.http.get(this.server + '/api/auth/profile/', this.getHeader()));
        this.userData$.next({
          username: res.username,
          first_name: res.first_name,
          last_name: res.last_name
        });
        this.loggedIn$.next(true);
      } catch (err) {
        this.cookie.delete('accessToken');
        this.cookie.delete('loggedIn');
        this.cookie.deleteAll('/', 'localhost');
        this.loggedIn$.next(false);
      }
    } else {
      this.loggedIn$.next(false);
      this.userData$.next({
        username: "",
        first_name: "",
        last_name: ""
      });
    }
  }

  // api calls to login and get token
  login(apiPayLoad: { username: string, password: string }) {
    return this.http.post(this.server + '/api/auth/login/', apiPayLoad)
      .pipe(
        tap({
          next: (data: any) => {
            this.cookie.set('accessToken', data.access);
            this.cookie.set('loggedIn', `true`);
            this.checkUser();
          },
          error: (error) => console.log(error)
        })
      )
  }

  // deletes the cookie and logs user out
  logout() {
    this.cookie.delete('accessToken');
    this.cookie.delete('loggedIn');
    this.cookie.deleteAll('/', 'localhost');
    this.checkUser()
  }

  searchUsers(to_search: string) {
    return this.http.get(this.server + '/api/auth/findusers/' + to_search, this.getHeader())
  }

  // Gets all the headers
  getHeader() {
    return { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('accessToken')}`) }
  }
}
