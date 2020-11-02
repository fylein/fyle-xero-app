import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryMappingsDialogComponent } from './category-mappings-dialog.component';

describe('CategoryMappingsDialogComponent', () => {
  let component: CategoryMappingsDialogComponent;
  let fixture: ComponentFixture<CategoryMappingsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryMappingsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryMappingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
