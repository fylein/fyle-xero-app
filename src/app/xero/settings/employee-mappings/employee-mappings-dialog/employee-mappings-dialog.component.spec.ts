import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMappingsDialogComponent } from './employee-mappings-dialog.component';

describe('EmployeeMappingsDialogComponent', () => {
  let component: EmployeeMappingsDialogComponent;
  let fixture: ComponentFixture<EmployeeMappingsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeMappingsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMappingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
