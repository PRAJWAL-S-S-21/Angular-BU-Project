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
  showPopup: boolean = false; // Controls popup visibility
  formattedFormData: string = ''; //Stores JSON formatted data

  constructor(private formConfigService: FormConfigService) {}

  ngOnInit() {
    this.formConfigService.formFields$.subscribe(fields => {
      this.fields = [...fields];
      this.sortFields();
      this.initializeFormData();
    });
  }

  sortFields() {
    this.sortedFields = [...this.fields].sort((a, b) => a.order - b.order);
  }

  initializeFormData() {
    this.sortedFields.forEach(field => {
      if (this.formData[field.name] === undefined) {
        this.formData[field.name] = ''; // Set default value to empty string
      }
    });
  }

  validateName() {
    const nameValue = this.formData['name']?.trim() || '';
    const nameRegex = /^[A-Za-z][A-Za-z\s]*$/;

    if (nameValue === '') {
      this.nameError = false;
    } else if (!nameRegex.test(nameValue)) {
      this.nameError = true;
    } else {
      this.nameError = false;
    }

    this.formData['name'] = nameValue;
  }

  validateMobile() {
    let mobileNumber = this.formData['mobile']?.trim() || '';
    const mobileRegex = /^\d{10}$/; //Only 10-digit numbers allowed

    if (mobileNumber === '') {
      this.mobileError = false;
    } else if (!mobileRegex.test(mobileNumber)) {
      this.mobileError = true;
    } else {
      this.mobileError = false;
    }

    this.formData['mobile'] = mobileNumber.replace(/\D/g, ''); //Remove non-numeric characters
  }

  validateEmail() {
    const emailValue = this.formData['email']?.trim() || '';
    const emailRegex = /^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailValue === '') {
      this.emailError = false;
    } else if (!emailRegex.test(emailValue)) {
      this.emailError = true;
    } else {
      this.emailError = false;
    }
  }

  openConfirmationPopup() {
    //Validate required fields
    const missingRequiredField = this.sortedFields.find(field => field.required && !this.formData[field.name]?.trim());
    if (missingRequiredField) {
      alert(`Please fill the required field: ${missingRequiredField.label}`);
      return;
    }

    //Prevent submission if all fields are empty
    const isAllEmpty = Object.values(this.formData).every(value => value === '');
    if (isAllEmpty) {
      alert("You must fill at least one field before submitting.");
      return;
    }

    // Convert form data to JSON format for display
    this.formattedFormData = JSON.stringify(this.formData, null, 2);
    this.showPopup = true; // Show popup
  }

  editForm() {
    this.showPopup = false; // Close popup and return to form
  }

  submitForm() {
    this.showPopup = false; // Close popup
    alert('Form submitted successfully!'); // Replace with actual submission logic
  }

  closePopup() {
    this.showPopup = false; //Close popup when clicking "X"
  }
}
