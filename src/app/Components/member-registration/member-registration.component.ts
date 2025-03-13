import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormConfigService } from '../../services/form-config.service';

interface FieldConfig {
  name: string;
  required: boolean;
  show: boolean;
  order: number;
  validationType?: string;      // To specify additional validation rules
}

@Component({
  selector: 'app-member-registration',
  templateUrl: './member-registration.component.html',
  styleUrls: ['./member-registration.component.scss']
})
export class MemberRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  showPopup = false;
popupTitle = '';
popupMessage = '';

  fields: FieldConfig[] = [];

  constructor(private fb: FormBuilder, private configService: FormConfigService) {}

  ngOnInit(): void {
    const configuredFields: FieldConfig[] = this.configService.getFields() || [];
    this.fields = configuredFields
      .filter((field: FieldConfig) => field.show)
      .sort((a: FieldConfig, b: FieldConfig) => a.order - b.order);
  
    let formControls: { [key: string]: any } = {};
  
    this.fields.forEach((field: FieldConfig) => {
      let validations = [];
      
      if (field.required) {
        validations.push(Validators.required);
      }
  
      // Name validation (No numbers or special characters)
      if (field.name.toLowerCase() === 'name') {
        validations.push(Validators.minLength(3));                 // Length of the name must be greater than 3
        // validations.push(Validators.pattern(/^[a-zA-Z].*$/));      // Only alphabets and spaces allowed
        validations.push(Validators.pattern(/\D+\w+/));      // Only alphabets and spaces allowed
      }
  
      // Email validation
      if (field.name.toLowerCase() === 'email') {
        // validations.push(Validators.email);
        validations.push(Validators.pattern(/^[a-z][a-zA-Z0-9._+-]*@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/))
      } 
  
      // Mobile number validation (Indian format)
      if (field.name.toLowerCase() === 'mobile') {
        validations.push(Validators.pattern(/^[6-9]\d{9}$/));
      }

      // Address validation
      if (field.name.toLowerCase() === 'Address') {
        validations.push(Validators.pattern(/^[A-Za-z0-9\s,.-]{10,100}$/));
      }

  
      formControls[field.name.toLowerCase()] = [null, validations];
    });
  
    this.registrationForm = this.fb.group(formControls);
  }
  

  submitForm(): void {
    if (this.registrationForm.invalid) {
      this.showPopup = true;
      this.popupTitle = 'Error';
      this.popupMessage = '❌ Please fill all required fields correctly';
      return;
    }
  
    this.showPopup = true;
    this.popupTitle = 'Success';
    this.popupMessage = '✅ Form Submitted Successfully';
  }

  closePopup(): void {
    this.showPopup = false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registrationForm.get(fieldName);
    if (!control) return '';
    if (control.hasError('pattern') && fieldName === 'name') return 'Name can only contain alphabets and spaces';
    if (control.hasError('required')) return `${fieldName} is required`;
    if (control.hasError('email')) return `Invalid email address`;
    if (control.hasError('pattern')) return `Invalid ${fieldName} format`;
    return '';
  }
}
