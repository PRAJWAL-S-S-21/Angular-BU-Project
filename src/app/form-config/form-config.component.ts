import { Component, EventEmitter, Output } from '@angular/core';
import { FormField } from '../models/form-field.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormConfigService } from '../services/form-config.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-config',
  templateUrl: './form-config.component.html',
  styleUrls: ['./form-config.component.scss']
})
export class FormConfigComponent {

  editableFields: FormField[] = [];
  isAddressEnabled: boolean = false;

  constructor(private formConfigService: FormConfigService,private toastr:ToastrService) {}

  ngOnInit() {
    // Load existing field configurations from the shared service
    this.formConfigService.formFields$.subscribe(fields => {
      this.editableFields = JSON.parse(JSON.stringify(fields)); // Deep copy to avoid direct modifications
      const addressField = this.editableFields.find(fields => fields.name === 'address');
      this.isAddressEnabled = addressField ? addressField.show : false;
      console.log(this.isAddressEnabled);
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

    if(field.label==='Address')
      {
        this.editableFields.forEach(f=>{
          if(f.label==='State' || f.label==='City' || f.label === 'Pincode'){
            f.show=field.show;
          }
        })
      }


  }

  saveChanges() {
    // Save updated fields into the shared service so other pages (Register) can access them
    this.formConfigService.updateFields(this.editableFields);
    this.toastr.success('Configuration Saved Successfully')
  }

  isAddressEnabledfalse(){
    const addressField=this.editableFields.find(f=>f.label==='Address');
    return !addressField?.show;
  }
}
