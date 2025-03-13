import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import Kendo UI Modules
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';

// Import Components
import { AppComponent } from './app.component'; // ✅ Ensure AppComponent is imported
import { FormConfigurationComponent } from './Components/form-configuration/form-configuration.component';
import { MemberRegistrationComponent } from './Components/member-registration/member-registration.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragAndDropModule } from '@progress/kendo-angular-utils';
import { PopupMessageComponent } from './Components/popup-message/popup-message.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';






@NgModule({
  declarations: [
    AppComponent,
    FormConfigurationComponent,
    MemberRegistrationComponent,
    NavbarComponent,
    PopupMessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule, 
    DragAndDropModule, // Kendo Grid Module
    ButtonsModule, // Kendo Buttons Module
    InputsModule, BrowserAnimationsModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // Allows Kendo UI components
  bootstrap: [AppComponent] // Make sure AppComponent is bootstrapped
})
export class AppModule { }
