import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseGroupsComponent } from './expense-groups.component';

describe('ExpenseGroupsComponent', () => {
  let component: ExpenseGroupsComponent;
  let fixture: ComponentFixture<ExpenseGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
