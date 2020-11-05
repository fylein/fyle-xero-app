import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ExpenseGroupsService } from '../../../core/services/expense-groups.service';
import { forkJoin, Observable } from 'rxjs';
import { TasksService } from '../../../core/services/tasks.service';
import { environment } from 'src/environments/environment';
import { ExpenseGroup } from 'src/app/core/models/expense-group.model';
import { StorageService } from 'src/app/core/services/storage.service';
import { WindowReferenceService } from 'src/app/core/services/window.service';

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
  task: any;
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
    const clusterDomain = this.storageService.get('clusterDomain');
    this.windowReference.open(`${clusterDomain}/app/main/#/enterprise/view_expense/${expenseId}`, '_blank');
  }

  initExpenseGroupDetails() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    return that.expenseGroupsService.getExpensesGroupById(that.expenseGroupId).toPromise().then((expenseGroup) => {
      that.expenseGroup = expenseGroup;
      return expenseGroup;
    });
  }

  initTasks() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    return that.tasksService.getTasksByExpenseGroupId(that.expenseGroupId).toPromise().then((tasks) => {
      if (tasks.length > 0) {
        that.task = tasks[0];
        that.showMappingErrors = that.task.detail ? true : false;
        that.showXeroErrors = that.task.xero_errors ? true : false;
        that.status = that.task.status;
      }
    });
  }

  ngOnInit() {
    this.workspaceId = +this.route.snapshot.params.workspace_id;
    this.expenseGroupId = +this.route.snapshot.params.expense_group_id;
    this.state = this.route.snapshot.firstChild.routeConfig.path.toUpperCase() || 'INFO';

    forkJoin(
      [
        this.initExpenseGroupDetails(),
        this.initTasks()
      ]
    ).subscribe(response => {
      this.isLoading = false;
    });
  }

}
