import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DragTargetContainerDirective, DropTargetContainerDirective, DropTargetEvent } from '@progress/kendo-angular-utils';
import { FormConfigService } from 'src/app/services/form-config.service';

@Component({
  selector: 'app-form-configuration',
  templateUrl: './form-configuration.component.html',
  styleUrls: ['./form-configuration.component.scss']
})
export class FormConfigurationComponent {

  fields = [
    { name: 'Name', show: true, required: false, order: 1 },
    { name: 'Mobile', show: true, required: false, order: 2 },
    { name: 'Email', show: false, required: false, order: 3 },
    { name: 'Address', show: false, required: false, order: 4 }
  ];

  @ViewChild("wrapper", { read: DragTargetContainerDirective })
  public dragTargetContainer!: DragTargetContainerDirective;
  @ViewChild("wrapper", { read: DropTargetContainerDirective })
  public dropTargetContainer!: DropTargetContainerDirective;


  constructor(private configService: FormConfigService, private router: Router) {
    this.fields = this.configService.getFields();
  }

  public dragData = ({ dragTarget }: { dragTarget: HTMLElement }) => {
    return Number(dragTarget.getAttribute("data-kendo-grid-item-index"));
  };

  public onDrop(e: DropTargetEvent): void {
    const fromIndex = e.dragData;
    const destinationIndex = this.calculateDestinationIndex(e);
    this.updateFieldsOrder(fromIndex, destinationIndex);
    this.dragTargetContainer.notify();
    this.dropTargetContainer.notify();
  }

  private updateFieldsOrder(fromIndex: number, toIndex: number) {
    const movedItem = this.fields.splice(fromIndex, 1)[0];
    this.fields.splice(toIndex, 0, movedItem);
  }

  private calculateDestinationIndex(e: DropTargetEvent): number {
    const dropTargetElement = e.dropTarget as HTMLTableRowElement | null;
  
    if (!dropTargetElement) {
      return this.fields.length - 1; // Default to last position if not found
    }
  
    const rowElements = Array.from(
      dropTargetElement.closest("kendo-grid")?.querySelectorAll("tr") || []
    );
  
    let dropIndex = rowElements.indexOf(dropTargetElement) - 1;
    return dropIndex < 0 ? 0 : dropIndex; // Ensure index is not negative
  }
  

  
  saveChanges() {
    // Update the order property based on the current order of the fields array
    this.fields.forEach((field, index) => {
      field.order = index + 1;
    });

    alert('Configuration Saved Successfully!');
  }

  
  
}
