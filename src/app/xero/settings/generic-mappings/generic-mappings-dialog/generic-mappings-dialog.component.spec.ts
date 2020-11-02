import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericMappingsDialogComponent } from './generic-mappings-dialog.component';

describe('GenericMappingsDialogComponent', () => {
  let component: GenericMappingsDialogComponent;
  let fixture: ComponentFixture<GenericMappingsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericMappingsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericMappingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
