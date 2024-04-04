import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './modules/pages/landing-page/landing-page.component';
import { LoginComponent } from './modules/pages/login/login.component';
import { RegisterComponent } from './modules/pages/register/register.component';
import { DocumentListingComponent } from './modules/pages/document-listing/document-listing.component';
import { EditorComponent } from './modules/editor/editor.component';
import { AuthenticationGuard, LoginGuard } from './core/guards';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [LoginGuard],
    component: LandingPageComponent
  },
  {
    path: 'login',
    canActivate: [LoginGuard],
    component: LoginComponent
  },
  {
    path: 'register',
    canActivate: [LoginGuard],
    component: RegisterComponent
  },
  {
    path: 'documents',
    canActivate: [AuthenticationGuard],
    component: DocumentListingComponent
  },
  {
    path: 'document/:id',
    canActivate: [AuthenticationGuard],
    component: EditorComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
