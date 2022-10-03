import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLoginComponent } from './shared-login.component';

describe('SharedLoginComponent', () => {
  let component: SharedLoginComponent;
  let fixture: ComponentFixture<SharedLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
