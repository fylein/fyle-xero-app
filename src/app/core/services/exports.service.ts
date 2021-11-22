import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class ExportsService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) {}

  triggerExports(expenseGroupIds: { personal: number[], ccc: number[] }) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(
      `/workspaces/${workspaceId}/xero/exports/trigger/`, {
        expense_group_ids: expenseGroupIds
      }
    );
  }
}
