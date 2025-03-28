import { NgModule, Pipe } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { FormConfigComponent } from './form-config/form-config.component';
import { MemberRegistrationComponent } from './member-registration/member-registration.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { pipe } from 'rxjs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { ToastrModule } from 'ngx-toastr';







@NgModule({
  declarations: [
    AppComponent,
    FormConfigComponent,
    MemberRegistrationComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    InputsModule,
    BrowserAnimationsModule,
    DropDownsModule,
    ButtonsModule,
    GridModule,
    CommonModule,
    FormsModule,
    DragDropModule,
    AppRoutingModule,
    DialogsModule,
    HttpClientModule,
    DialogsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
        timeOut:3000,
        progressBar:true,
        progressAnimation:'decreasing'
      }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
