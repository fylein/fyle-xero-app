import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncExportComponent } from './sync-export.component';

describe('SyncExportComponent', () => {
  let component: SyncExportComponent;
  let fixture: ComponentFixture<SyncExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
