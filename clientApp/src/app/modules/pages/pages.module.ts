import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DocumentListingComponent } from './document-listing/document-listing.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    DocumentListingComponent,
    LandingPageComponent
  ],
  imports: [
    CommonModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzListModule,
    NzModalModule,
    RouterModule,
    NzIconModule,
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    DocumentListingComponent,
    LandingPageComponent
  ]
})
export class PagesModule { }
