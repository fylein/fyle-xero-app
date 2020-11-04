import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupXeroErrorComponent } from './group-xero-error.component';

describe('GroupMappingErrorComponent', () => {
  let component: GroupXeroErrorComponent;
  let fixture: ComponentFixture<GroupXeroErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupXeroErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupXeroErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
