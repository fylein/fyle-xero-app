import { Component, OnInit } from '@angular/core';
import { ExpenseGroupsService } from '../../../../core/services/expense-groups.service';
import { ActivatedRoute } from '@angular/router';
import { ExpenseGroup } from 'src/app/core/models/expense-group.model';
import { forkJoin } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Expense } from 'src/app/core/models/expense.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { WindowReferenceService } from 'src/app/core/services/window.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss', '../../../xero.component.scss']
})
export class InfoComponent implements OnInit {
  expenseGroupId: number;
  workspaceId: number;
  expenseGroup: ExpenseGroup;
  isLoading = false;
  expenses: MatTableDataSource<Expense> = new MatTableDataSource([]);
  count: number;
  columnsToDisplay = ['expense_number', 'claimno', 'view'];
  expenseGroupFields = [];
  windowReference: Window;

  constructor(
    private expenseGroupsService: ExpenseGroupsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private storageService: StorageService,
    private windowReferenceService: WindowReferenceService) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.expenses.filter = filterValue.trim().toLowerCase();
  }

  getTitle(name: string) {
    return name.replace(/_/g, ' ');
  }

  initExpenseGroupExpenses() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    return that.expenseGroupsService.getExpensesByExpenseGroupId(that.expenseGroupId).toPromise().then((expenses) => {
      that.count = expenses.length;
      that.expenses = new MatTableDataSource(expenses);
    });
  }

  initExpenseGroupDetails() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    return that.expenseGroupsService.getExpensesGroupById(that.expenseGroupId).toPromise().then((expenseGroup) => {
      that.expenseGroup = expenseGroup;
      that.expenseGroupFields = Object.keys(expenseGroup.description);
    });
  }

  openExpenseInFyle(expense) {
    const that = this;
    const clusterDomain = this.storageService.get('clusterDomain');
    const user = that.authService.getUser();
    this.windowReference.open(`${clusterDomain}/app/main/#/enterprise/view_expense/${expense.expense_id}?org_id=${user.org_id}`, '_blank');
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.snapshot.parent.params.workspace_id;
    that.expenseGroupId = +that.route.snapshot.parent.params.expense_group_id;

    that.isLoading = true;
    forkJoin([
      that.initExpenseGroupExpenses(),
      that.initExpenseGroupDetails()
    ]).subscribe(() => {
      that.isLoading = false;
    });
  }
}
