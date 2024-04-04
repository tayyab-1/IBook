import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ISection } from 'src/app/core/interfaces';
import { GeneralService, SectionService } from 'src/app/core/services';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent {

  loading: boolean = false
  name: string = ''
  addSubSection: boolean = false
  editSectionTitle: boolean = false

  @Input() data: ISection = {
    id: 0,
    name: "",
    data: "",
    level: 0,
    document: 0
  };
  @Output() populateEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private sectionService: SectionService,
    private generalService: GeneralService,
    private modal: NzModalService,
  ) { }

  sectionSelected() {
    this.sectionService.section$.next(this.data);
  }

  createNewSection() {
    this.loading = true
    this.sectionService.createSection(this.data.id, this.data.document, this.name, '', 0).subscribe({
      next: _ => {
        this.generalService.createMessage('success', 'New section created');
        this.populateEvent.next(true);
        this.loading = false
        this.addSubSection = false
        this.name = '';
      },
      error: _ => {
        this.generalService.createMessage('error', 'Could not create new section')
        this.name = '';
        this.loading = false
      }
    })
  }

  editSection() {
    this.loading = true
    this.sectionService.updateSection(this.data.id, this.name, this.data.data, 0).subscribe({
      next: _ => {
        this.generalService.createMessage('success', 'Section Edited');
        this.populateEvent.next(true);
        this.loading = false
        this.addSubSection = false
        this.name = '';
      },
      error: _ => {
        this.generalService.createMessage('error', 'Could not updated section')
        this.loading = false
        this.name = '';
      }
    })
  }

  deleteSectionConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this document?',
      nzContent: `<b style="color: red;">"${this.data.name}"</b><br>
                  <p>Deleting section will delete all its sub sections as well!</p>`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.sectionService.deleteSection(this.data.id).subscribe({
          next: _ => {
            this.generalService.createMessage('warning', 'Section Deleted');
            this.populateEvent.next(true);
          },
          error: _ => {
            this.generalService.createMessage('error', 'Could not delete section');
          }
        })
      },
      nzCancelText: 'No',
    });
  }

  editClick() {
    this.editSectionTitle = true
    this.addSubSection = false
  }

  handleCancel() {
    this.addSubSection = false
    this.editSectionTitle = false
  }

  addChildClick() {
    this.addSubSection = true
    this.editSectionTitle = false
  }
}
