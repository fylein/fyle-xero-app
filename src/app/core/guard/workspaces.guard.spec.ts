import { TestBed, async, inject } from '@angular/core/testing';

import { WorkspacesGuard } from './workspaces.guard';

describe('WorkspacesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkspacesGuard]
    });
  });

  it('should ...', inject([WorkspacesGuard], (guard: WorkspacesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
