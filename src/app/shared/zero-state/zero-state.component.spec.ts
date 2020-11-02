import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroStateComponent } from './zero-state.component';

describe('ZeroStateComponent', () => {
  let component: ZeroStateComponent;
  let fixture: ComponentFixture<ZeroStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZeroStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZeroStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
