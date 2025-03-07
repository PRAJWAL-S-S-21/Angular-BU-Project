import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormConfigComponent } from './form-config/form-config.component';
import { MemberRegistrationComponent } from './member-registration/member-registration.component';

const routes: Routes = [
  { path: 'configure', component: FormConfigComponent },
  { path: 'register', component: MemberRegistrationComponent },
  { path: '', redirectTo: '/register', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
