import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XeroComponent } from './xero.component';

describe('XeroComponent', () => {
  let component: XeroComponent;
  let fixture: ComponentFixture<XeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XeroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
