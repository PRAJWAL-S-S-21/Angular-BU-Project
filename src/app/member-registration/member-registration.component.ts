import { Component } from '@angular/core';
import { FormField } from '../models/form-field.model';
import { FormConfigService } from '../services/form-config.service';
import { CountryService } from '../services/countries.service';

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
  selectedCountryCode: string = '';
  emailSuggestions: string[] = [];
  showSuggestions = false;
  countries: any[] = [];

  constructor(private formConfigService: FormConfigService, private countryService: CountryService) { }

  ngOnInit() {
    this.formConfigService.formFields$.subscribe(fields => {
      this.fields = [...fields];
      this.sortFields();
      this.initializeFormData();
    });

    this.countryService.getCountries().subscribe(countries => {
      this.countries = countries;
    })
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

  // Used to select the country code and add it to the mobile number 
  onCountryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedCode = target.value; // Get selected country code
    const selectedCountry = this.countries.find(c => c.code === selectedCode);


    if (selectedCountry) {
      this.selectedCountryCode = selectedCountry.code;
      this.formData['mobile'] = this.selectedCountryCode + ' ';

      // Update email suggestions when the country is selected
      if (selectedCountry.emailDomains) {
        this.emailSuggestions = selectedCountry.emailDomains.map((domain: string) => `yourname@${domain}`);
        console.log(this.emailSuggestions)
        this.showSuggestions = this.emailSuggestions.length > 0;
      } else {
        this.emailSuggestions = [];
        this.showSuggestions = false;
      }
    }
  }

  //Used to suggest the email 
  selectEmailSuggestion(suggestion: any) {
    this.formData['email'] = suggestion;
    this.showSuggestions = false;
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
    const mobileRegex = /\+\d{2,4}\s*\d{10}$/; //Only 10-digit numbers allowed

    if (mobileNumber === '') {
      this.mobileError = false;
    } else if (!mobileRegex.test(mobileNumber)) {
      this.mobileError = true;
    } else {
      this.mobileError = false;
    }

  }
  validateEmail() {
    const emailValue = this.formData['email']?.trim() || '';
    const emailRegex = /^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailParts = emailValue.split('@');

    if (emailValue === '') {
      this.emailError = false;
      this.showSuggestions = false;
      return;
    }

    if (!emailRegex.test(emailValue)) {
      this.emailError = true;
      this.showSuggestions = false;
      return;
    }

    this.emailError = false;

    // Ensure suggestions are available if country has email domains
    const selectedCountry = this.countries.find(c => c.code === this.selectedCountryCode);
    if (selectedCountry && selectedCountry.emailDomains && emailParts.length === 1) {
      this.emailSuggestions = selectedCountry.emailDomains.map((domain: string) => `${emailParts[0]}@${domain}`);
      this.showSuggestions = this.emailSuggestions.length > 0;
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
    // this.formattedFormData = JSON.stringify(this.formData, null, 2);
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
