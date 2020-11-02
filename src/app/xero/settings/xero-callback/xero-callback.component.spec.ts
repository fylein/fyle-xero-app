import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XeroCallbackComponent } from './xero-callback.component';

describe('XeroCallbackComponent', () => {
  let component: XeroCallbackComponent;
  let fixture: ComponentFixture<XeroCallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XeroCallbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XeroCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
