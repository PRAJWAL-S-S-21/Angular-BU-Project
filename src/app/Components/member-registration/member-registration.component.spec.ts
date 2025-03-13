import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberRegistrationComponent } from './member-registration.component';

describe('MemberRegistrationComponent', () => {
  let component: MemberRegistrationComponent;
  let fixture: ComponentFixture<MemberRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberRegistrationComponent]
    });
    fixture = TestBed.createComponent(MemberRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
