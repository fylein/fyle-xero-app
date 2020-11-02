import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseFieldConfigurationComponent } from './expense-field-configuration.component';

describe('ExpenseFieldConfigurationComponent', () => {
  let component: ExpenseFieldConfigurationComponent;
  let fixture: ComponentFixture<ExpenseFieldConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseFieldConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseFieldConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
