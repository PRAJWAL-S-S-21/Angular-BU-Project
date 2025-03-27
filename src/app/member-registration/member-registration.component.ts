import { Component } from '@angular/core';
import { FormField } from '../models/form-field.model';
import { FormConfigService } from '../services/form-config.service';

@Component({
  selector: 'app-member-registration',
  templateUrl: './member-registration.component.html',
  styleUrls: ['./member-registration.component.scss']
})
export class MemberRegistrationComponent {
  fields: FormField[] = [];
  sortedFields: FormField[] = [];
  formData: { [key: string]: any } = {};
  submitted = false;
  mobileError: boolean = false;
  nameError: boolean = false;
  emailError: boolean = false;
  isMobileNumberLessThanTen: boolean = false;
  showPopup: boolean = false; 
  formattedFormData: string = ''; 

  currentStep : number = 1;
  isAddressEnabled: boolean = false;

  constructor(private formConfigService: FormConfigService) {}

  ngOnInit() {
    this.formConfigService.formFields$.subscribe(fields => {
      this.fields = [...fields];
      this.sortFields();
      this.initializeFormData();

      const addressField = this.fields.find(fields => fields.name === 'address');
      this.isAddressEnabled = addressField ? addressField.show : false;
    });
  }

  sortFields() {
    this.sortedFields = [...this.fields].sort((a, b) => a.order - b.order);    
  }

  initializeFormData() {
    this.sortedFields.forEach(field => {
      if (this.formData[field.name] === undefined) {
        this.formData[field.name] = ''; 
      }
    });
  }


  validateField(fieldName: string) {
    if (fieldName === 'name') {
      const nameValue = this.formData['name']?.trim() || '';
      this.nameError = nameValue !== '' && !/^[A-Za-z][A-Za-z\s]*$/.test(nameValue);
    } else if (fieldName === 'mobile') {
      const mobileValue = this.formData['mobile']?.trim() || '';
      this.mobileError = mobileValue !== '' && !/^\d{10}$/.test(mobileValue);
    } else if (fieldName === 'email') {
      const emailValue = this.formData['email']?.trim() || '';
      this.emailError = emailValue !== '' && !/^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailValue);
    }
  }

  validateMobile()
  {
    const mobileValue = this.formData['mobile']?.trim() || '';
    this.mobileError = mobileValue != '' && !/^\d{10}$/.test(mobileValue);
  }

  restrictMobileInput(event : KeyboardEvent)
  {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value || '';

    if (event.key === 'Backspace' || event.key === 'Delete' || 
      event.key === 'ArrowLeft' || event.key === 'ArrowRight' || 
      event.key === 'Tab') 
      {
        return;
      }

    if(!/^\d$/.test(event.key))
    {
      event.preventDefault();
    }

    if(currentValue.length >= 10)
    {
      event.preventDefault();
    }

  }

  nextStep() {
    const missingRequiredField = this.sortedFields.find(field =>
      field.required && field.order <= 4 && !this.formData[field.name]?.trim()
    );
    if (missingRequiredField) {
      alert(`Please fill the required field: ${missingRequiredField.label}`);
      return;
    } 
    this.currentStep = 2;
  }

  prevStep() {
    this.currentStep = 1;
  }

  openConfirmationPopup() {

    const missingRequiredField = this.sortedFields.find(field => field.required && !this.formData[field.name]?.trim());
    if (missingRequiredField) {
      alert(`Please fill the required field: ${missingRequiredField.label}`);
      return;
    }

    const isAllEmpty = Object.values(this.formData).every(value => value === '');
    if (isAllEmpty) {
      alert("You must fill at least one field before submitting.");
      return;
    }
    
    this.showPopup = true; 
  }

  editForm() {
    this.showPopup = false; 
  }

  submitForm() {
    this.showPopup = false; 
    alert('Form submitted successfully!');
    this.formData = {};
    this.currentStep = 1;
    this.initializeFormData();
  }

  closePopup() {
    this.showPopup = false;
  }

  getMaterialIcon(fieldName: string): string {
    const iconMap: { [key: string]: string } = {
      'name': 'person',
      'mobile': 'phone',
      'email': 'email',
      'address': 'location_on',
      'city': 'location_city',
      'state': 'flag',
      'pincode': 'pin_drop'
    };
  
    return iconMap[fieldName] || 'help_outline';
  }
  
}
