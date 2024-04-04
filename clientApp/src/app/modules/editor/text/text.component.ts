import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';
import { ISection } from 'src/app/core/interfaces';
import { DocumentsService, GeneralService, PusherService, SectionService } from 'src/app/core/services';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class TextComponent implements OnInit, OnDestroy {
  data: ISection = {
    id: 0,
    name: "",
    data: "",
    level: 0,
    document: 0
  }
  fullDocHTML: string = "";
  previewWholeDocument: boolean = false;
  editingSection: boolean = false;
  documentID: number = 0;

  @Output() populateEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('editorSection') rteObj!: RichTextEditorComponent;

  tools: object = {
    items: ['Undo', 'Redo', '|',
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'SubScript', 'SuperScript', '|',
      'LowerCase', 'UpperCase', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink',
      '|', 'ClearFormat', 'SourceCode'
    ]
  };

  unSavedHtml: string = '';
  unSavedSectionName: string = '';

  constructor(
    private documentService: DocumentsService,
    private route: ActivatedRoute,
    private generalService: GeneralService,
    private sectionService: SectionService,
    private pusherService: PusherService,
  ) { }

  ngOnInit(): void {
    this.subscribeSocketChannels();

    this.route.params.subscribe(params => {
      this.documentID = params['id'];
      this.previewDocument(true);
    })

    this.sectionService.section$.subscribe((res: ISection) => {
      if (res.id) {
        this.sectionService.getSection(res.id).subscribe({
          next: (sect: any) => {
            this.data = sect;
            this.unSavedHtml = this.data.data;
            this.unSavedSectionName = this.data.name;
            this.previewWholeDocument = false;
            this.editingSection = false;
          },
          error: (err) => {
            this.generalService.createMessage('error', `Could not load.${err.details}`)
          }
        })
      }
    })

    this.sectionService.preview$.subscribe((res: boolean) => {
      this.previewDocument(res)
    })
  }

  onDoubleClick() {
    const selectedText = window.getSelection()?.toString();
    if (selectedText?.trim().length) this.documentService.searchKeyword$.next(selectedText.trim());
  }

  previewDocument(shouldShow: boolean) {
    this.documentID && this.documentService.getDocPreview(this.documentID).subscribe({
      next: (res: any) => {
        this.fullDocHTML = res;
        if (shouldShow) {
          this.previewWholeDocument = shouldShow
        }
      }
    })
  }

  saveSection(previewAfter: boolean) {
    let rteHTML: string = this.rteObj.getHtml()
    this.sectionService.updateSection(this.data.id, this.unSavedSectionName, rteHTML, 0).subscribe({
      next: (res: any) => {
        this.data = res
        if (previewAfter) {
          this.editingSection = false
        }
      }
    })
    this.populateEvent.next(true);
  }

  discardChanges() {
    this.editingSection = false
    this.unSavedHtml = this.data.data;
  }

  subscribeSocketChannels() {
    const documentsChannel = this.pusherService.init('doc-channel');

    documentsChannel.bind('doc-update', (data: { docId: number }) => {
      if (data.docId == this.documentID) {
        this.documentService.fetchDocumentsList$.next(true);
        !this.previewWholeDocument && this.sectionService.section$.next(this.data);
        this.previewWholeDocument && this.previewDocument(true);
      }
    })
  }

  ngOnDestroy() {
    this.pusherService.unsubscribe('doc-channel');
  }
}
