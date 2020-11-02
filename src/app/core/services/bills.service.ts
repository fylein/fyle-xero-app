import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { Cacheable } from 'ngx-cacheable';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) {}

  // TODO: Map response to a model
  createBills(expenseGroupIds: number[]) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(
      `/workspaces/${workspaceId}/netsuite/bills/trigger/`, {
        expense_group_ids: expenseGroupIds
      }
    );
  }
}
