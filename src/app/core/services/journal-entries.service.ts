import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class JournalEntriesService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) {}

  // TODO: Map response to a model
  createJournalEntries(expneseGroupIds: number[]) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(
      `/workspaces/${workspaceId}/netsuite/journal_entries/trigger/`, {
        expense_group_ids: expneseGroupIds
      }
    );
  }
}
