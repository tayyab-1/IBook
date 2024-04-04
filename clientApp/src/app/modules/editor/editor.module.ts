import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { SectionComponent } from './section/section.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { TextComponent } from './text/text.component';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';

@NgModule({
  declarations: [
    EditorComponent,
    SectionComponent,
    TextComponent
  ],
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    NzTreeModule,
    NzIconModule,
    NzButtonModule,
    NzModalModule,
    FormsModule,
    ReactiveFormsModule,
    MatTreeModule,
    MatIconModule,
    NzDropDownModule,
    RichTextEditorModule,
    NzFormModule,
    NzPopconfirmModule,
    NzInputModule,
    NzListModule
  ],
  exports: [
    EditorComponent
  ]
})
export class EditorModule { }
