import { Component, EventEmitter, Output } from '@angular/core';
import { FormField } from '../models/form-field.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormConfigService } from '../services/form-config.service';

@Component({
  selector: 'app-form-config',
  templateUrl: './form-config.component.html',
  styleUrls: ['./form-config.component.scss']
})
export class FormConfigComponent {

  editableFields: FormField[] = [];

  constructor(private formConfigService: FormConfigService) {}

  ngOnInit() {
    // Load existing field configurations from the shared service
    this.formConfigService.formFields$.subscribe(fields => {
      this.editableFields = JSON.parse(JSON.stringify(fields)); // Deep copy to avoid direct modifications
    });
  }

  drop(event: CdkDragDrop<FormField[]>) {
    moveItemInArray(this.editableFields, event.previousIndex, event.currentIndex);
    this.editableFields.forEach((field, index) => (field.order = index + 1));
  }

  onShowChange(field: FormField) {
    if (!field.show) {
      field.required = false; // Automatically uncheck "Required" when "Show" is unticked
    }
  }

  saveChanges() {
    // Save updated fields into the shared service so other pages (Register) can access them
    this.formConfigService.updateFields(this.editableFields);
    alert('Form configuration saved!');
  }

}
