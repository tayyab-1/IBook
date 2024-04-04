import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { IWordData } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  searchKeyword$: Subject<string> = new Subject<string>();
  fetchDocumentsList$: Subject<boolean> = new Subject<boolean>();
  server: string = environment.apiURL;

  constructor(
    private cookie: CookieService,
    private http: HttpClient
  ) { }

  getDocumentList() {
    return this.http.get(this.server + '/api/document/', this.getHeader())
  }

  deleteDoc(id: number) {
    return this.http.delete(this.server + '/api/document/' + id, this.getHeader())
  }

  getDoc(id: number) {
    return this.http.get(this.server + '/api/document/' + id, this.getHeader())
  }

  updateDoc(title: string, id: number) {
    return this.http.put(this.server + '/api/document/', { title, id }, this.getHeader())
  }

  createDoc(title: string) {
    return this.http.post(this.server + '/api/document/', { title }, this.getHeader())
  }

  addUserToDocument(username: string, id: number) {
    return this.http.post(this.server + '/api/document/ownership/' + id, { username }, this.getHeader())
  }

  getDocFullTree(doc: number) {
    return this.http.get(this.server + `/api/document/full/${doc}`, this.getHeader())
  }

  getDocPreview(doc: number) {
    return this.http.get(this.server + `/api/document/preview/${doc}`, this.getHeader())
  }

  // Gets all the headers
  getHeader() {
    return { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('accessToken')}`) }
  }

  getWordDefinition(keyword: string) {
    const headers = new HttpHeaders({
      'X-RapidAPI-Key': environment.rapidApiKey,
      'X-RapidAPI-Host': environment.rapidApiHost,
    });
    return this.http.get<IWordData>(`https://wordsapiv1.p.rapidapi.com/words/${keyword}/definitions`, { headers });
  }
}
