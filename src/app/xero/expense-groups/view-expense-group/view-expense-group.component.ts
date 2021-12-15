import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseGroupsService } from '../../../core/services/expense-groups.service';
import { forkJoin } from 'rxjs';
import { TasksService } from '../../../core/services/tasks.service';
import { ExpenseGroup } from 'src/app/core/models/expense-group.model';
import { StorageService } from 'src/app/core/services/storage.service';
import { WindowReferenceService } from 'src/app/core/services/window.service';
import { Task } from 'src/app/core/models/task.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-expense-group',
  templateUrl: './view-expense-group.component.html',
  styleUrls: ['./view-expense-group.component.scss', '../expense-groups.component.scss', '../../xero.component.scss']
})
export class ViewExpenseGroupComponent implements OnInit {
  workspaceId: number;
  expenseGroupId: number;
  expenses: ExpenseGroup[];
  isLoading = true;
  expenseGroup: ExpenseGroup;
  task: Task;
  state: string;
  pageSize: number;
  pageNumber: number;
  status: string;
  showMappingErrors = false;
  showXeroErrors = false;
  windowReference: Window;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private expenseGroupsService: ExpenseGroupsService,
    private tasksService: TasksService,
    private storageService: StorageService,
    private windowReferenceService: WindowReferenceService) {
      this.windowReference = this.windowReferenceService.nativeWindow;
    }

  changeState(state: string) {
    const that = this;
    if (that.state !== state) {
      that.state = state;
      that.router.navigate([`workspaces/${this.workspaceId}/expense_groups/${this.expenseGroupId}/view/${state.toLowerCase()}`]);
    }
  }

  openExpenseInFyle(expenseId: string) {
    this.windowReference.open(`${environment.fyle_app_url}/app/main/#/enterprise/view_expense/${expenseId}`, '_blank');
  }

  ngOnInit() {
    const that = this;

    that.workspaceId = +that.route.snapshot.params.workspace_id;
    that.expenseGroupId = +that.route.snapshot.params.expense_group_id;
    that.state = that.route.snapshot.firstChild.routeConfig.path.toUpperCase() || 'INFO';

    forkJoin(
      [
        that.expenseGroupsService.getExpensesGroupById(that.expenseGroupId),
        that.tasksService.getTasksByExpenseGroupId(that.expenseGroupId)
      ]
    ).subscribe(response => {
      that.isLoading = false;

      that.expenseGroup = response[0];
      if (response[1].length > 0) {
        that.task = response[1][0];
        that.showMappingErrors = that.task.detail ? true : false;
        that.showXeroErrors = that.task.xero_errors ? true : false;
        that.status = that.task.status;
      }
    });
  }

}
