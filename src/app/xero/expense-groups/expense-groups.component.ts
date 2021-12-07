import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, ActivationEnd } from '@angular/router';
import { ExpenseGroupsService } from '../../core/services/expense-groups.service';
import { ExpenseGroup } from 'src/app/core/models/expense-group.model';
import { MatTableDataSource } from '@angular/material/table';
import { SettingsService } from 'src/app/core/services/settings.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { TasksService } from 'src/app/core/services/tasks.service';
import { WindowReferenceService } from 'src/app/core/services/window.service';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { Subscription } from 'rxjs';
import { WorkspaceService } from 'src/app/core/services/workspace.service';
import { Workspace } from 'src/app/core/models/workspace.model';

@Component({
  selector: 'app-expense-groups',
  templateUrl: './expense-groups.component.html',
  styleUrls: ['./expense-groups.component.scss', '../xero.component.scss'],
})
export class ExpenseGroupsComponent implements OnInit, OnDestroy {
  workspaceId: number;
  expenseGroups: MatTableDataSource<ExpenseGroup> = new MatTableDataSource([]);
  isLoading = true;
  count: number;
  state: string;
  settings: GeneralSetting;
  pageNumber = 0;
  pageSize: number;
  columnsToDisplay = ['employee', 'expensetype'];
  windowReference: Window;
  routerEventSubscription: Subscription;
  xeroShortCode: string;

  constructor(
    private route: ActivatedRoute,
    private taskService: TasksService,
    private expenseGroupService: ExpenseGroupsService,
    private router: Router,
    private settingsService: SettingsService,
    private windowReferenceService: WindowReferenceService,
    private storageService: StorageService,
    private workspaceService: WorkspaceService) {
      this.windowReference = this.windowReferenceService.nativeWindow;
    }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.expenseGroups.filter = filterValue.trim().toLowerCase();
  }

  onPageChange(event) {
    const that = this;

    that.isLoading = true;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        page_number: event.pageIndex,
        page_size: event.pageSize,
        state: that.state
      }
    };

    that.router.navigate([`workspaces/${that.workspaceId}/expense_groups`], navigationExtras);
  }


  changeState(state: string) {
    const that = this;
    if (that.state !== state) {
      that.isLoading = true;
      const navigationExtras: NavigationExtras = {
        queryParams: {
          page_number: 0,
          page_size: that.pageSize,
          state
        }
      };

      that.router.navigate([`workspaces/${that.workspaceId}/expense_groups`], navigationExtras);
    }
  }

  getPaginatedExpenseGroups() {
    return this.expenseGroupService.getExpenseGroups(this.pageSize, this.pageNumber * this.pageSize, this.state).subscribe(expenseGroups => {
      this.count = expenseGroups.count;
      this.expenseGroups = new MatTableDataSource(expenseGroups.results);
      this.expenseGroups.filterPredicate = this.searchByText;
      this.isLoading = false;
      return expenseGroups;
    });
  }

  goToExpenseGroup(id: number) {
    this.router.navigate([`workspaces/${this.workspaceId}/expense_groups/${id}/view`]);
  }

  reset() {
    const that = this;
    that.workspaceId = +that.route.snapshot.params.workspace_id;
    that.pageNumber = +that.route.snapshot.queryParams.page_number || 0;
    let cachedPageSize = that.storageService.get('expense-groups.pageSize') || 10;
    that.pageSize = +that.route.snapshot.queryParams.page_size || cachedPageSize;
    that.state = that.route.snapshot.queryParams.state || 'FAILED';
    that.settingsService.getGeneralSettings(that.workspaceId).subscribe((settings) => {
      if (that.state === 'COMPLETE') {
        that.columnsToDisplay = ['export-date', 'employee', 'export', 'expensetype', 'openXero'];
      } else {
        that.columnsToDisplay = ['employee', 'expensetype'];
      }

      that.settings = settings;
      that.getPaginatedExpenseGroups();
    });

    that.routerEventSubscription = that.router.events.subscribe(event => {
      if (event instanceof ActivationEnd  && that.router.url === `/workspaces/${that.workspaceId}/expense_groups?page_number=${+event.snapshot.queryParams.page_number}&page_size=${event.snapshot.queryParams.page_size}&state=${event.snapshot.queryParams.state}`) {
        const pageNumber = +event.snapshot.queryParams.page_number || 0;
        if (+event.snapshot.queryParams.page_size) {
          that.storageService.set('expense-groups.pageSize', +event.snapshot.queryParams.page_size);
          cachedPageSize = +event.snapshot.queryParams.page_size;
        }

        const pageSize = +event.snapshot.queryParams.page_size || cachedPageSize;
        const state = event.snapshot.queryParams.state || 'FAILED';

        if (that.pageNumber !== pageNumber || that.pageSize !== pageSize || that.state !== state) {
          if (state === 'COMPLETE') {
            that.columnsToDisplay = ['export-date', 'employee', 'export', 'expensetype', 'openXero'];
          } else {
            that.columnsToDisplay = ['employee', 'expensetype'];
          }

          that.pageNumber = pageNumber;
          that.pageSize = pageSize;
          that.state = state;
          that.getPaginatedExpenseGroups();
        }
      }
    });
  }

  openInXero(itemId, accountId, type) {
    const that = this;

    let xeroUrl = 'https://go.xero.com';

    if (type === 'CREATING_BILL') {
      if (that.xeroShortCode) {
        xeroUrl = `${xeroUrl}/organisationlogin/default.aspx?shortcode=${that.xeroShortCode}&redirecturl=/AccountsPayable/Edit.aspx?InvoiceID=${itemId}`;
      } else {
        xeroUrl = `${xeroUrl}/AccountsPayable/View.aspx?invoiceID=${itemId}`;
      }
    } else if (type === 'CREATING_BANK_TRANSACTION') {
      if (that.xeroShortCode) {
        xeroUrl = `${xeroUrl}/organisationlogin/default.aspx?shortcode=${that.xeroShortCode}&redirecturl=/Bank/ViewTransaction.aspx?bankTransactionID=${itemId}`;
      } else {
        xeroUrl = `${xeroUrl}/Bank/ViewTransaction.aspx?bankTransactionID=${itemId}&accountID=${accountId}`;
      }
    }

    that.windowReference.open(xeroUrl, '_blank');
  }

  openInXeroHandler(clickedExpenseGroup: ExpenseGroup) {
    // tslint:disable-next-line: deprecation
    event.preventDefault();
    // tslint:disable-next-line: deprecation
    event.stopPropagation();
    const that = this;
    that.isLoading = true;
    that.taskService.getTasksByExpenseGroupId(clickedExpenseGroup.id).subscribe(tasks => {
      that.isLoading = false;
      const completeTask = tasks.filter(task => task.status === 'COMPLETE')[0];

      if (completeTask) {
        const typeMap = {
          CREATING_BILL: {
            itemId: (task) => task.detail.Invoices[0].InvoiceID,
            accountId: (task) => task.status
          },
          CREATING_BANK_TRANSACTION: {
            itemId: (task) => task.detail.BankTransactions[0].BankTransactionID,
            accountId: (task) => task.detail.BankTransactions[0].BankAccount.AccountID
          }
        };

        that.openInXero(typeMap[completeTask.type].itemId(completeTask), typeMap[completeTask.type].accountId(completeTask), completeTask.type);
      }
    });
  }

  searchByText(data: ExpenseGroup, filterText: string) {
    return data.description.employee_email.includes(filterText) ||
      ('Reimbursable'.toLowerCase().includes(filterText) && data.fund_source === 'PERSONAL') ||
      ('Corporate Credit Card'.toLowerCase().includes(filterText) && data.fund_source !== 'PERSONAL') ||
      data.description.claim_number.includes(filterText);
  }

  ngOnInit() {
    const that = this;
    const cachedWorkspace = that.storageService.get('workspace');

    if (!cachedWorkspace) {
      that.workspaceService.getWorkspaceById().subscribe((workspace: Workspace) => {
        that.storageService.set('workspace', workspace);
        that.xeroShortCode = workspace.xero_short_code;
        that.reset();
        that.expenseGroups.filterPredicate = that.searchByText;
      });
    } else {
      that.xeroShortCode = cachedWorkspace.xero_short_code;
      that.reset();
      that.expenseGroups.filterPredicate = that.searchByText;
    }
  }

  ngOnDestroy() {
    if (this.routerEventSubscription) {
      this.routerEventSubscription.unsubscribe();
    }
  }

}
