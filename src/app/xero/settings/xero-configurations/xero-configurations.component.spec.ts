import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XeroConfigurationsComponent } from './xero-configurations.component';

describe('XeroConfigurationsComponent', () => {
  let component: XeroConfigurationsComponent;
  let fixture: ComponentFixture<XeroConfigurationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XeroConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XeroConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
