import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormConfigurationComponent } from './Components/form-configuration/form-configuration.component';
import { MemberRegistrationComponent } from './Components/member-registration/member-registration.component';

const routes: Routes = [
  { path: '', redirectTo: '/form-config', pathMatch: 'full' }, // Default route
  { path: 'form-config', component: FormConfigurationComponent },
  { path: 'member-registration', component: MemberRegistrationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
