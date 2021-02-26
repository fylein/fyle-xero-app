import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { ExpenseGroupResponse } from 'src/app/core/models/expense-group-response.model';
import { ExpenseGroup } from 'src/app/core/models/expense-group.model';
import { Expense } from '../models/expense.model';
import { WorkspaceService } from './workspace.service';
import { ExpenseGroupSetting } from '../models/expense-group-setting.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseGroupsService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) {}

  getExpenseGroups(limit: number, offset: number, state: string): Observable<ExpenseGroupResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/fyle/expense_groups/`,
      {
        limit,
        offset,
        state
      }
    );
  }

  getAllExpenseGroups(state: string): Observable<ExpenseGroupResponse> {
    const limit = 500;
    const offset = 0;
    // this would require to create a default object - not much benefit in doing so imho @Dhar
    // tslint:disable-next-line: prefer-const
    let allExpenseGroupsResponse;

    return from(this.getAllExpenseGroupsInternal(limit, offset, state, allExpenseGroupsResponse));
  }

  getExpenseGroupSettings(): Observable<ExpenseGroupSetting> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_group_settings/`, {});
  }

  createExpenseGroupsSettings(expensesGroupedBy: string[], expenseState: string[], exportDateType: string): Observable<ExpenseGroupResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/fyle/expense_group_settings/`, {
      expenses_grouped_by: expensesGroupedBy,
      expense_state: expenseState,
      export_date_type: exportDateType
    });
  }


  // TODO: remove promises and do with rxjs observables
  private getAllExpenseGroupsInternal(limit: number, offset: number, state: string, allExpenseGroupsResponse: ExpenseGroupResponse): Promise<ExpenseGroupResponse> {
    const that = this;
    return that.getExpenseGroups(limit, offset, state).toPromise().then((expenseGroupRes) => {
      if (!allExpenseGroupsResponse) {
        allExpenseGroupsResponse = expenseGroupRes;
      } else {
        allExpenseGroupsResponse.results = allExpenseGroupsResponse.results.concat(expenseGroupRes.results);
      }

      if (allExpenseGroupsResponse.results.length < allExpenseGroupsResponse.count) {
        return that.getAllExpenseGroupsInternal(limit, offset + 500, state, allExpenseGroupsResponse);
      } else {
        return allExpenseGroupsResponse;
      }
    });
  }

  getExpensesByExpenseGroupId(expenseGroupId: number): Observable<Expense[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_groups/${expenseGroupId}/expenses/`, {});
  }

  getExpensesGroupById(expenseGroupId: number): Observable<ExpenseGroup> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_groups/${expenseGroupId}/`, {});
  }

  syncExpenseGroups() {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/fyle/expense_groups/trigger/`, {});
  }
}
