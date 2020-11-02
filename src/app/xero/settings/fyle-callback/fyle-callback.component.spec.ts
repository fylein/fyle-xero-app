import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FyleCallbackComponent } from './fyle-callback.component';

describe('FyleCallbackComponent', () => {
  let component: FyleCallbackComponent;
  let fixture: ComponentFixture<FyleCallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FyleCallbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FyleCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
