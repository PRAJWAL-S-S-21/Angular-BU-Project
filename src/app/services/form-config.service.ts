import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormField } from '../models/form-field.model';

@Injectable({
  providedIn: 'root'
})
export class FormConfigService {

  constructor() { }

  private formFieldsSource = new BehaviorSubject<FormField[]>([
    { name: 'name', label: 'Name', type: 'text', show: true, required: true, order: 1 },
    { name: 'mobile', label: 'Mobile', type: 'tel', show: true, required: false, order: 2 },
    { name: 'email', label: 'Email', type: 'email', show: true, required: true, order: 3 },
    { name: 'address', label: 'Address', type: 'textarea', show: true, required: false, order: 4 },

    { name: 'city', label: 'City', type: 'text', show: true, required: false, order: 5 },
    { name: 'state', label: 'State', type: 'text', show: true, required: false, order: 6 },
    { name: 'pincode', label: 'Pincode', type: 'text', show: false, required: false, order: 7 },

  ]);

  formFields$ = this.formFieldsSource.asObservable();

  updateFields(newFields: FormField[]) {
    console.log(newFields);
    this.formFieldsSource.next(newFields);
  }
}
