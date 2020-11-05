import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class BankTransactionsService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) {}

  // TODO: Map response to a model
  createBankTransactions(expenseGroupIds: number[]) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(
      `/workspaces/${workspaceId}/xero/bank_transactions/trigger/`, {
        expense_group_ids: expenseGroupIds
      }
    );
  }
}
