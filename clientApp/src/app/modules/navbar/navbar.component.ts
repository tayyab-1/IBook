import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPerson } from 'src/app/core/interfaces';
import { AuthenticationService, DocumentsService, GeneralService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public appURL: string = environment.appURL
  public loggedIn: boolean = false;
  public userData: IPerson = {
    username: "",
    first_name: "",
    last_name: ""
  }
  public documents: any[] = []

  constructor(
    private authService: AuthenticationService,
    private generalService: GeneralService,
    private router: Router,
    private documentService: DocumentsService
  ) {
    this.authService.checkUser()
  }

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe((logged: boolean) => {
      this.loggedIn = logged;
    })

    this.authService.userData$.subscribe((data: IPerson) => {
      this.userData = data;
    })

    this.documentService.fetchDocumentsList$.subscribe(_ => {
      this.getDocumentsList()
    })
  }

  getDocumentsList() {
    this.documentService.getDocumentList().subscribe({
      next: (res: any) => {
        this.documents = res;
      }
    })
  }

  logoutHandler(): void {
    this.authService.logout();
    this.generalService.createMessage('warning', 'Logged Out!')
    this.router.navigate(['/'])
  }

  docClick(docId: number) {
    this.router.navigate(['/document', docId])
  }
}
