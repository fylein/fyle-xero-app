import { Component, OnInit } from '@angular/core';
import { ExpenseGroupsService } from 'src/app/core/services/expense-groups.service';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from 'src/app/core/services/tasks.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { Task } from 'src/app/core/models/task.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { ExpenseGroupSettingsDialogComponent } from './expense-group-settings-dialog/expense-group-settings-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, from, interval } from 'rxjs';
import { WorkspaceService } from 'src/app/core/services/workspace.service';
import { switchMap, takeWhile } from 'rxjs/operators';
import { Workspace } from 'src/app/core/models/workspace.model';
import { ExpenseGroupSetting } from 'src/app/core/models/expense-group-setting.model';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss', '../../xero.component.scss']
})
export class SyncComponent implements OnInit {

  workspaceId: number;
  workspace: Workspace;
  isLoading: boolean;
  isExpensesSyncing: boolean;
  isEmployeesSyncing: boolean;
  errorOccurred = false;
  expenseGroupSettings: ExpenseGroupSetting;

  constructor(private expenseGroupService: ExpenseGroupsService, private route: ActivatedRoute, private settingsService: SettingsService, private taskService: TasksService, private snackBar: MatSnackBar, private workspaceService: WorkspaceService, public dialog: MatDialog) { }

  syncExpenses() {
    const that = this;
    that.isExpensesSyncing = true;
    that.expenseGroupService.syncExpenseGroups().subscribe((res) => {
      that.checkSyncStatus();
    }, (error) => {
      that.isExpensesSyncing = false;
      that.snackBar.open('Import Failed');
      that.errorOccurred = true;
    });
  }

  checkSyncStatus() {
    const that = this;
    const lastSyncedAt = that.workspace.last_synced_at;
    const taskType = ['FETCHING_EXPENSES'];
    const taskStatus = ['IN_PROGRESS', 'ENQUEUED'];
    interval(3000).pipe(
      switchMap(() => from(that.taskService.getAllTasks(taskStatus, [], taskType))),
      takeWhile((response) => response.results.filter(task => task.status === 'IN_PROGRESS'  && task.type === 'FETCHING_EXPENSES').length > 0, true)
    ).subscribe((res) => {
      if (!res.results.length) {
        that.updateLastSyncStatus().subscribe((response) => {
            if (response[0].last_synced_at !== lastSyncedAt) {
              that.snackBar.open('Import Complete');
            } else {
              const expenseState = that.expenseGroupSettings.expense_state.toLowerCase().replace('_', ' ');
              that.snackBar.open(`No new expense groups were imported. Kindly check your Fyle account to see if there are any expenses in the ${expenseState} state`, null, {
                duration: 5000
              });
            }
        });
        that.isExpensesSyncing = false;
      }
    });
  }

  getDescription() {
    const that = this;

    const expenseState: string = that.expenseGroupSettings.expense_state;

    return {
      expenseState: expenseState.replace(/_/g, ' '),
    };
  }

  open() {
    const that = this;
    let dialogWidth = '450px';

    that.settingsService.getGeneralSettings(that.workspaceId).subscribe(response => {
      if (response.corporate_credit_card_expenses_object) {
        dialogWidth = '750px';
      }
    });

    const dialogRef = that.dialog.open(ExpenseGroupSettingsDialogComponent, {
      width: dialogWidth,
      data: {
        workspaceId: that.workspaceId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      that.updateLastSyncStatus();
    });
  }


  updateLastSyncStatus() {
    const that = this;
    return from(forkJoin(
      [
        that.workspaceService.getWorkspaceById(),
        that.expenseGroupService.getExpenseGroupSettings()
      ]
    ).toPromise().then(res => {
      that.workspace = res[0];
      that.expenseGroupSettings = res[1];
      that.isLoading = false;
      return res;
  }));
}

  ngOnInit() {
    const that = this;
    that.isLoading = true;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;

    that.isExpensesSyncing = false;
    this.updateLastSyncStatus();
  }

}
