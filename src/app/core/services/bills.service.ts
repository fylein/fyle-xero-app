import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) {}

  createBills(expenseGroupIds: number[]) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(
      `/workspaces/${workspaceId}/xero/bills/trigger/`, {
        expense_group_ids: expenseGroupIds
      }
    );
  }
}
