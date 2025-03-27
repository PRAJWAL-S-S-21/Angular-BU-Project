import { Component } from '@angular/core';
import { FormField } from './models/form-field.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'member-registraion-form';

  // fields: FormField[] = [
  //   { name: 'firstName', label: 'First Name', type: 'text', show: true, required: true, order: 1 },
  //   { name: 'lastName', label: 'Last Name', type: 'text', show: true, required: false, order: 2 },
  //   { name: 'email', label: 'Email', type: 'email', show: true, required: true, order: 3 },
  //   { name: 'phone', label: 'Phone', type: 'tel', show: false, required: false, order: 4 },
  // ];

  // updateFields(updatedFields: FormField[]) {
  //   // Replace the fields array to trigger change detection
  //   this.fields = [...updatedFields];
  // }

}
