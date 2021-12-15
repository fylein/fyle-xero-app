import { Component, OnInit } from '@angular/core';
import { ExpenseGroupsService } from '../../../../core/services/expense-groups.service';
import { ActivatedRoute } from '@angular/router';
import { ExpenseGroup } from 'src/app/core/models/expense-group.model';
import { forkJoin } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Expense } from 'src/app/core/models/expense.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { WindowReferenceService } from 'src/app/core/services/window.service';
import { environment } from 'src/environments/environment';

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
    private windowReferenceService: WindowReferenceService) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.expenses.filter = filterValue.trim().toLowerCase();
  }

  getTitle(name: string) {
    name = name.replace('claim_number', 'report_number');
    return name.replace(/_/g, ' ');
  }

  openExpenseInFyle(expense) {
    const that = this;
    const user = that.authService.getUser();
    this.windowReference.open(`${environment.fyle_app_url}/app/main/#/enterprise/view_expense/${expense.expense_id}?org_id=${user.org_id}`, '_blank');
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.snapshot.parent.params.workspace_id;
    that.expenseGroupId = +that.route.snapshot.parent.params.expense_group_id;

    that.isLoading = true;
    forkJoin([
      that.expenseGroupsService.getExpensesByExpenseGroupId(that.expenseGroupId),
      that.expenseGroupsService.getExpensesGroupById(that.expenseGroupId)
    ]).subscribe(response => {
      that.isLoading = false;

      that.count = response[0].length;
      that.expenses = new MatTableDataSource(response[0]);

      that.expenseGroup = response[1];
      that.expenseGroupFields = Object.keys(response[1].description);
    });
  }
}
