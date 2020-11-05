import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseGroupSettingsDialogComponent } from './expense-group-settings-dialog.component';

describe('ExpenseGroupSettingsDialogComponent', () => {
  let component: ExpenseGroupSettingsDialogComponent;
  let fixture: ComponentFixture<ExpenseGroupSettingsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseGroupSettingsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseGroupSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
