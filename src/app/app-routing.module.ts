import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormConfigComponent } from './form-config/form-config.component';
import { MemberRegistrationComponent } from './member-registration/member-registration.component';
import { LoginComponent } from './login/login.component';
import { authGuardGuard } from './auth-guard.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'configure', component: FormConfigComponent,canActivate:[authGuardGuard] },
  { path: 'register', component: MemberRegistrationComponent },
  { path: '', redirectTo: '/register', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
