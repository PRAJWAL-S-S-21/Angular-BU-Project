import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormConfigService {
  private storageKey = 'form-config';

  getFields() {
    const storedConfig = localStorage.getItem(this.storageKey);
    return storedConfig ? JSON.parse(storedConfig) : [
      { name: 'Name', show: true, required: false, order: 1 },
      { name: 'Mobile', show: true, required: false, order: 2 },
      { name: 'Email', show: false, required: false, order: 3 },
      { name: 'Address', show: false, required: false, order: 4 }
    ];
  }

  setFields(fields: any[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(fields));
  }
}
