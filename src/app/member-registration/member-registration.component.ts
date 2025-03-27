import { Component } from '@angular/core';
import { FormField } from '../models/form-field.model';
import { FormConfigService } from '../services/form-config.service';
import { CountryService } from '../services/country.service';

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

  selectedCountryCode: string = '';
  emailSuggestions: string[] = [];
  showSuggestions = false;
  countries: any[] = [];
  showCountryDropdown = false;
  private suggestionTimeout: any;

  constructor(private formConfigService: FormConfigService, private countryService: CountryService) { }

  ngOnInit() {
    this.formConfigService.formFields$.subscribe(fields => {
      this.fields = [...fields];
      this.sortFields();
      this.initializeFormData();

      const addressField = this.fields.find(fields => fields.name === 'address');
      this.isAddressEnabled = addressField ? addressField.show : false;
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
  

  toggleCountryDropdown() {
    this.showCountryDropdown = !this.showCountryDropdown;
  }

  getSelectedCountryFlag(): string {
    if (!this.selectedCountryCode) return '';
    const country = this.countries.find(c => c.code === this.selectedCountryCode);
    return country ? country.flag : '';
  }

  selectCountry(country: any) {
    this.selectedCountryCode = country.code;
    // this.formData['mobile'] = country.code + ' ';
    this.showCountryDropdown = false;
    
    // Update email suggestions
    if (country.emailDomains) {
      this.emailSuggestions = country.emailDomains.map((domain: string) => `@${domain}`);
      // this.showSuggestions = this.emailSuggestions.length > 0;
    } else {
      this.emailSuggestions = [];
      this.showSuggestions = false;
    }
  }

  validateEmail() {
    const emailValue = this.formData['email']?.trim() || '';
    if (emailValue.includes("@")) {
      this.showSuggestions = this.emailSuggestions.length > 0;
    }
    const emailParts = emailValue.split('@');
   
    
    // Always hide suggestions when empty
    if (!emailValue) {
      this.showSuggestions = false;
      this.emailError = false;
      return;
    }
  
    // Show suggestions only when before @ symbol
    if (emailParts.length === 1) {
      console.log('praj bsdk')
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

selectEmailSuggestion(suggestion: any) {
  this.formData['email'] = suggestion.trim();
  this.showSuggestions = false;
  this.emailError = false;
}
}
