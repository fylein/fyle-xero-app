import { Component, OnInit } from '@angular/core';
import { ExpenseGroupsService } from 'src/app/core/services/expense-groups.service';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from 'src/app/core/services/tasks.service';
import { Task } from 'src/app/core/models/task.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { ExpenseGroupSettingsDialogComponent } from './expense-group-settings-dialog/expense-group-settings-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss', '../../xero.component.scss']
})
export class SyncComponent implements OnInit {

  workspaceId: number;
  lastTask: Task;
  isLoading: boolean;
  isExpensesSyncing: boolean;
  isEmployeesSyncing: boolean;
  errorOccurred = false;
  expenseGroupSettings: any;

  constructor(private expenseGroupService: ExpenseGroupsService, private route: ActivatedRoute, private taskService: TasksService, private snackBar: MatSnackBar, private formBuilder: FormBuilder, public dialog: MatDialog) { }

  syncExpenses() {
    const that = this;
    that.isExpensesSyncing = true;
    that.expenseGroupService.syncExpenseGroups().subscribe((res) => {
      that.updateLastSyncStatus();
      that.snackBar.open('Import Complete');
      that.isExpensesSyncing = false;
    }, (error) => {
      that.isExpensesSyncing = false;
      that.snackBar.open('Import Failed');
      that.errorOccurred = true;
    });
  }

  getDescription() {
    const that = this;

    const allowedFields = ['vendor', 'claim_number', 'settlement_id', 'category']    

    var expensesGroupedByList = []
    that.expenseGroupSettings.reimbursable_expense_group_fields.forEach(element => {
      if (allowedFields.indexOf(element) >= 0) {
        if (element === 'vendor') {
          element = 'Merchant';
        } else if (element === 'claim_number') {
          element = 'Expense Report';
        } else if (element === 'settlement_id') {
          element = 'Payment'
        } else if (element === 'category') {
          element = 'Category'
        }
        expensesGroupedByList.push(element);
      }
    });

    const expensesGroupedBy = expensesGroupedByList.join(', ');
    const expenseState: string = that.expenseGroupSettings.expense_state
    var exportDateType = null;

    if (that.expenseGroupSettings.export_date_type === 'spent_at') {
      exportDateType = 'Spend Date';
    } else if (that.expenseGroupSettings.export_date_type === 'approved_at') {
      exportDateType = 'Approval Date';
    } else if (that.expenseGroupSettings.export_date_type === 'verified_at') {
      exportDateType = 'Verification Date';
    }

    return {
      expensesGroupedBy: expensesGroupedBy,
      expenseState: expenseState.replace(/_/g, ' '),
      exportDateType: exportDateType
    };
  }

  open() {
    const that = this;
    const dialogRef = that.dialog.open(ExpenseGroupSettingsDialogComponent, {
      width: '450px',
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
    that.isLoading = true;
    forkJoin(
      [
        that.taskService.getTasks(1, 0, 'ALL'),
        that.expenseGroupService.getExpenseGroupSettings()
      ]
    )

    .subscribe((res) => {
      if (res[0].count > 0) {
        that.lastTask = res[0].results[0];
      }
      that.expenseGroupSettings = res[1];
      that.isLoading = false;
    });
  }

  ngOnInit() {
    const that = this;
    that.isLoading = true;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;

    that.isExpensesSyncing = false;
    this.updateLastSyncStatus();
  }

}
