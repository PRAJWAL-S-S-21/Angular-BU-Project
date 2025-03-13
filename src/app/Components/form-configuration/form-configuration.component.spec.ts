import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConfigurationComponent } from './form-configuration.component';

describe('FormConfigurationComponent', () => {
  let component: FormConfigurationComponent;
  let fixture: ComponentFixture<FormConfigurationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormConfigurationComponent]
    });
    fixture = TestBed.createComponent(FormConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
