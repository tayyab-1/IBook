import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { ISection } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  server: string = environment.apiURL;
  preview$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  section$: Subject<ISection> = new Subject<ISection>();

  constructor(
    private cookie: CookieService,
    private http: HttpClient
  ) { }

  createSection(pid: number, doc: number, name: string, data: string, level: number) {
    return this.http.post(this.server + `/api/section/parent/${pid}/${doc}`, { name, data, level }, this.getHeader())
  }

  getSection(sectionId: number) {
    return this.http.get(this.server + `/api/section/${sectionId}`, this.getHeader())
  }

  getChild(pid: number, doc: number) {
    return this.http.get(this.server + `/api/section/parent/${pid}/${doc}`, this.getHeader())
  }

  updateSection(sectionID: number, name: string, data: string, level: number) {

    return this.http.put(this.server + '/api/section/' + `${sectionID}`, { name, data, level }, this.getHeader())
  }

  deleteSection(sectionID: number) {
    return this.http.delete(this.server + `/api/section/${sectionID}`, this.getHeader())
  }

  // Gets all the headers
  getHeader() {
    return { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('accessToken')}`) }
  }
}
