import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetsuiteConfigurationsComponent } from './netsuite-configurations.component';

describe('NetsuiteConfigurationsComponent', () => {
  let component: NetsuiteConfigurationsComponent;
  let fixture: ComponentFixture<NetsuiteConfigurationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetsuiteConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetsuiteConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
