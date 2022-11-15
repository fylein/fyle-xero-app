import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { Task } from '../models/task.model';
import { TaskResponse } from '../models/task-reponse.model';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) {}

  getTasks(limit: number, status: string[], expenseGroupIds: number[], taskType: string[], next: string): Observable<TaskResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const offset = 0;
    const apiParams = {
      limit,
      offset,
      status
    };
    if (expenseGroupIds && taskType) {
      const expenseKey = 'expense_group_ids';
      const typeKey = 'task_type';
      apiParams[expenseKey] = expenseGroupIds;
      apiParams[typeKey] = taskType;
    }

    if (next) {
      return this.apiService.get(next.split('api')[1], {});
    } else {
      return this.apiService.get(
        `/workspaces/${workspaceId}/tasks/all/`, apiParams
      );
    }
  }

  getAllTasks(status: string[], expenseGroupIds: number[] = null, taskType: string[] = null): Observable<TaskResponse> {
    const limit = 500;
    const offset = 0;
    const allTasks: TaskResponse = {
      count: 0,
      next: null,
      previous: null,
      results: []
    };

    return from(this.getAllTasksInternal(limit, status, expenseGroupIds, taskType, allTasks));
  }
  // TODO: remove promises and do with rxjs observables
  private getAllTasksInternal(limit: number, status: string[], expenseGroupIds: number[], taskType: string[], allTasks: TaskResponse): Promise<TaskResponse> {
    const that = this;
    return that.getTasks(limit, status, expenseGroupIds, taskType, allTasks.next).toPromise().then((taskResponse) => {
      if (allTasks.count === 0 ) {
        allTasks = taskResponse;
      } else {
        allTasks.results = allTasks.results.concat(taskResponse.results);
      }

      if (allTasks.results.length < allTasks.count) {
        return that.getAllTasksInternal(limit, status, expenseGroupIds, taskType, allTasks);
      } else {
        return allTasks;
      }
    });
  }

  getTasksByExpenseGroupId(expenseGroupId: number): Observable<Task[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/tasks/expense_group/${expenseGroupId}/`, {}
    );
  }
}
