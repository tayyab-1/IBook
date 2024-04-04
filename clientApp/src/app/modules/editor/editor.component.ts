import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { DocumentsService, GeneralService, PusherService, SectionService } from 'src/app/core/services';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { IWordData } from 'src/app/core/interfaces';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

  TREE_DATA: any[] = [];
  doc: any = {
    title: ""
  };
  docID: number = 0;
  public name: string = ''
  createNewParent: boolean = false
  loading: boolean = false
  console = console
  parent: number = 0
  selectedSection: any;
  searchKeyword: string = '';
  wordDefinition: IWordData = {
    word: '',
    definitions: [{
      partOfSpeech: '',
      definition: ''
    }]
  };
  searchNotFound: boolean = true;
  searchingWord: boolean = false;

  constructor(
    public documentService: DocumentsService,
    private route: ActivatedRoute,
    private sectionService: SectionService,
    private generalService: GeneralService,
    private pusherService: PusherService,
  ) {
    this.dataSource.data = this.TREE_DATA;
  }
  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();
  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.subscribeSocketChannels();

    this.route.params.subscribe(params => {
      this.docID = params['id'];
      this.documentService.getDoc(this.docID).subscribe({
        next: (res: any) => {
          this.doc = res;
          this.populateDocument(false);
        },
      })
    });

    this.documentService.searchKeyword$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.searchKeyword = value;
        this.searchWordSynonyms();
      });

    this.documentService.fetchDocumentsList$.next(true);
  }

  searchWordSynonyms() {
    this.wordDefinition.word = '';
    this.searchNotFound = false;
    this.searchingWord = true;

    this.documentService.getWordDefinition(this.searchKeyword).subscribe({
      next: (data: IWordData) => {
        this.wordDefinition = data;
        this.searchNotFound = false;
        this.searchingWord = false;
      },
      error: (error: any) => {
        if (error.status === 404) {
          this.searchNotFound = true;
          this.searchingWord = false;
        } else {
          this.searchingWord = false;
          console.error('Error occurred:', error);
        }
      }
    })
  }

  createNewSection() {
    if (!this.name.length) {
      this.generalService.createMessage('error', 'Cannot be empty')
      return
    }

    this.loading = true
    this.sectionService.createSection(this.parent, this.doc.id, this.name, '', 0).subscribe({
      next: _ => {
        this.generalService.createMessage('success', 'New section created');
        this.populateDocument(true)
        this.loading = false
        this.createNewParent = false
        this.name = '';
      },
      error: _ => {
        this.generalService.createMessage('error', 'Could not create new section')
        this.loading = false;
      }
    })
  }

  populateDocument(changedDone: boolean) {
    this.documentService.getDocFullTree(this.doc.id).subscribe({
      next: (res: any) => {
        this.TREE_DATA = res;
        this.dataSource.data = this.TREE_DATA;
        if (changedDone) {
          this.sectionService.preview$.next(false);
        }
      }
    })
  }

  handleCancel() {
    this.createNewParent = false;
  }

  parentCreateClick() {
    this.createNewParent = true;
    this.parent = 0;
  }

  previewRequest() {
    this.sectionService.preview$.next(true);
    this.generalService.createMessage('info', 'loading preview')
  }

  subscribeSocketChannels() {
    const documentsChannel = this.pusherService.init('doc-channel');

    documentsChannel.bind('doc-update', (data: { docId: number }) => {
      if (data.docId == this.docID) {
        this.documentService.fetchDocumentsList$.next(true);
        this.populateDocument(false);
      }
    })
  }

  ngOnDestroy() {
    this.pusherService.unsubscribe('doc-channel');
  }
}
