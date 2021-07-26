import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatoryFieldComponent } from './mandatory-field.component';

describe('MandatoryFieldComponent', () => {
  let component: MandatoryFieldComponent;
  let fixture: ComponentFixture<MandatoryFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatoryFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
