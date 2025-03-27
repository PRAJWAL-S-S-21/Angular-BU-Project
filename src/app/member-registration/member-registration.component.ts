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
  showCountryDropdown = false;
  private suggestionTimeout: any;



  constructor(private formConfigService: FormConfigService, private countryService: CountryService) { }

 // In your ngOnInit() method, modify it like this:
ngOnInit() {
  this.formConfigService.formFields$.subscribe(fields => {
    this.fields = [...fields];
    this.sortFields();
    this.initializeFormData();
  });

  this.countryService.getCountries().subscribe(countries => {
    this.countries = countries;
    // Set default country to India after countries are loaded
    const india = this.countries.find(c => c.code === '+91');
    this.selectCountry(india);
    if (india) {
      this.selectedCountryCode = '+91';
      // Initialize mobile field with country code if empty
      if (!this.formData['mobile']) {
        this.formData['mobile'] = '';
      }
    }
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

  // Used to select the country code and add it to the mobile number 
  onCountryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedCode = target.value; // Get selected country code
    const selectedCountry = this.countries.find(c => c.code === selectedCode);


    if (selectedCountry) {
      this.selectedCountryCode = selectedCountry.code;
      this.formData['mobile'] = this.selectedCountryCode + ' ';
      this.formData['flag'] = selectedCountry.flag;
      

      // Update email suggestions when the country is selected
      if (selectedCountry.emailDomains) {
        this.emailSuggestions = selectedCountry.emailDomains.map((domain: string) => `yourname@${domain}`);
        this.showSuggestions = this.emailSuggestions.length > 0;
      } else {
        this.emailSuggestions = [];
        this.showSuggestions = false;
      }
    }
  }

  toggleCountryDropdown() {
    this.showCountryDropdown = !this.showCountryDropdown;
  }
  
  selectCountry(country: any) {
    this.selectedCountryCode = country.code;
    // this.formData['mobile'] = country.code + ' ';
    this.showCountryDropdown = false;
    
    // Update email suggestions
    if (country.emailDomains) {
      this.emailSuggestions = country.emailDomains.map((domain: string) => `yourname@${domain}`);
      this.showSuggestions = this.emailSuggestions.length > 0;
    } else {
      this.emailSuggestions = [];
      this.showSuggestions = false;
    }
  }

  getSelectedCountryFlag(): string {
    if (!this.selectedCountryCode) return '';
    const country = this.countries.find(c => c.code === this.selectedCountryCode);
    return country ? country.flag : '';
  }

  //Used to suggest the email 
  selectEmailSuggestion(suggestion: any) {
    this.formData['email'] = suggestion.trim();
    this.showSuggestions = false;
    this.emailError = false;
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
    const mobileRegex = /\d{10}$/; //Only 10-digit numbers allowed

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
  const emailParts = emailValue.split('@');
  
  // Always hide suggestions when empty
  if (!emailValue) {
    this.showSuggestions = false;
    this.emailError = false;
    return;
  }

  // Show suggestions only when before @ symbol
  if (emailParts.length === 1) {
    const selectedCountry = this.countries.find(c => c.code === this.selectedCountryCode);
    if (selectedCountry?.emailDomains) {
      this.emailSuggestions = selectedCountry.emailDomains.map((domain:any) => `${emailValue}@${domain}`);
      this.showSuggestions = this.emailSuggestions.length > 0;
    }
  } else {
    this.showSuggestions = false;
  }

  // Validate email format
  const emailRegex = /^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,}$/;
  this.emailError = !emailRegex.test(emailValue);
}


onEmailFocus() {
  this.showSuggestions = true;
  if (this.suggestionTimeout) {
    clearTimeout(this.suggestionTimeout);
  }
}

onEmailBlur() {
  this.suggestionTimeout = setTimeout(() => {
    this.showSuggestions = false;
  }, 200);
}

  openConfirmationPopup() {
    this.formData['mobile'] = this.selectedCountryCode + '-' +this.formData['mobile'];

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
