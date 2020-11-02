import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryMappingsComponent } from './category-mappings.component';

describe('CategoryMappingsComponent', () => {
  let component: CategoryMappingsComponent;
  let fixture: ComponentFixture<CategoryMappingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryMappingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryMappingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
