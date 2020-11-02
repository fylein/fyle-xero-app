import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericMappingsComponent } from './generic-mappings.component';

describe('GenericMappingsComponent', () => {
  let component: GenericMappingsComponent;
  let fixture: ComponentFixture<GenericMappingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericMappingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericMappingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
