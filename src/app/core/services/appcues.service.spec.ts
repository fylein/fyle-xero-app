import { TestBed } from '@angular/core/testing';

import { AppcuesService } from './appcues.service';

describe('AppcuesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppcuesService = TestBed.get(AppcuesService);
    expect(service).toBeTruthy();
  });
});
