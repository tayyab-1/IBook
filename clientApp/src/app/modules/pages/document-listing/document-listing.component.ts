import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthenticationService, DocumentsService, GeneralService, PusherService } from 'src/app/core/services';

@Component({
  selector: 'app-documents-listing',
  templateUrl: './document-listing.component.html',
  styleUrls: ['./document-listing.component.scss']
})
export class DocumentListingComponent implements OnInit {
  userNameSearch$: Subject<string> = new Subject();
  documents: any[] = []
  isEditVisible: boolean = false;
  isShareVisible: boolean = false;
  document_in_q: any;
  new_title: string = '';
  editLoaded: boolean = false;
  users: any[] = []
  to_search_user: string = ''
  new_doc_bool: boolean = false
  new_doc_loaded: boolean = false

  constructor(
    private documentService: DocumentsService,
    private modal: NzModalService,
    private generalService: GeneralService,
    private authService: AuthenticationService,
    private pusherService: PusherService,
  ) { }

  ngOnInit(): void {
    this.subscribeSocketChannels();

    this.documentService.fetchDocumentsList$.next(true);
    this.getDocuments();

    this.userNameSearch$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(keyWord => {
        keyWord.trim().length && this.searchUsers(keyWord);
      });
  }

  getDocuments() {
    this.documentService.getDocumentList().subscribe({
      next: (res: any) => { this.documents = res; }
    })
  }

  parseDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  handleCancel() {
    this.isEditVisible = false;
    this.isShareVisible = false;
    this.new_title = '';
  }

  editClick(doc: any) {
    this.isEditVisible = true;
    this.document_in_q = doc;
  }

  shareClick(doc: any) {
    this.isShareVisible = true;
    this.document_in_q = doc;
  }

  saveNewTitle() {
    this.editLoaded = true;
    this.documentService.updateDoc(this.new_title, this.document_in_q.id).subscribe({
      next: _ => {
        this.editLoaded = false;
        this.new_title = '';
        this.generalService.createMessage('success', 'Title updated')
        this.isEditVisible = false;
        this.getDocuments();
      },
      error: _ => {
        this.editLoaded = false;
        this.generalService.createMessage('error', 'Could not update the document')
      }
    })
  }

  createNewDocClick() {
    this.new_doc_bool = true;
  }

  searchUsers(keyWord: string) {
    this.authService.searchUsers(keyWord).subscribe({
      next: (res: any) => { this.users = res }
    })
  }

  addNewUser(username: string) {
    this.documentService.addUserToDocument(username, this.document_in_q.id).subscribe({
      next: _ => {
        this.generalService.createMessage('success', 'Document shared successfully')
        this.isShareVisible = false;
        this.to_search_user = '';
        this.users = [];
      },
      error: _ => {
        this.isShareVisible = true;
        this.generalService.createMessage('error', 'Could not share the document')
      }
    })
  }

  createNewDoc() {
    if (!this.new_title.length) {
      this.generalService.createMessage('error', 'New document title cannot be empty')
      return
    }
    this.new_doc_loaded = false;
    this.documentService.createDoc(this.new_title).subscribe({
      next: _ => {
        this.new_doc_loaded = true;
        this.generalService.createMessage('success', 'New document created')
        this.new_doc_bool = false;
        this.new_title = '';
        this.getDocuments();
        this.documentService.fetchDocumentsList$.next(true);
      },
      error: _ => {
        this.new_doc_loaded = true;
        this.generalService.createMessage('error', 'Could not create the new document')
      }
    })
  }

  showDeleteConfirm(doc: any): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this document?',
      nzContent: `<b style="color: red;">"${doc.title}"</b>`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.documentService.deleteDoc(doc.id).subscribe({
          next: _ => {
            this.generalService.createMessage('warning', 'Document deleted');
            this.getDocuments();
          },
          error: _ => {
            this.generalService.createMessage('error', 'Could not delete the document');
          }
        })
      },
      nzCancelText: 'No',
    });
  }

  cancelNewDocument() {
    this.new_doc_bool = false;
    this.new_title = '';
  }

  subscribeSocketChannels() {
    const documentsChannel = this.pusherService.init('doc-channel');

    documentsChannel.bind('doc-update', (data: { docId: number }) => {
      if (!!this.documents.find(({ id }) => id == data.docId)) {
        this.documentService.fetchDocumentsList$.next(true);
        this.getDocuments();
      }
    })

    documentsChannel.bind('doc-share', (data: { ownerUsernames: string[] }) => {
      if (data.ownerUsernames.includes(this.authService.userData$.getValue().username)) {
        this.documentService.fetchDocumentsList$.next(true);
        this.getDocuments();
      }
    })
  }

  ngOnDestroy() {
    this.pusherService.unsubscribe('doc-channel');
  }
}
