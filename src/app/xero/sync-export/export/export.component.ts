import { Component, OnInit } from '@angular/core';
import { ExpenseGroup } from 'src/app/core/models/expense-group.model';
import { ExpenseGroupsService } from 'src/app/core/services/expense-groups.service';
import { ActivatedRoute } from '@angular/router';
import { ExportsService } from 'src/app/core/services/exports.service';
import { TasksService } from 'src/app/core/services/tasks.service';
import { interval, from, forkJoin } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from 'src/app/core/services/settings.service';
import { WindowReferenceService } from 'src/app/core/services/window.service';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { TaskResponse } from 'src/app/core/models/task-reponse.model';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss', '../../xero.component.scss']
})
export class ExportComponent implements OnInit {

  isLoading: boolean;
  isExporting: boolean;
  isProcessingExports: boolean;
  processingExportsCount: number;
  workspaceId: number;
  exportableExpenseGroups: ExpenseGroup[];
  generalSettings: GeneralSetting;
  failedExpenseGroupCount = 0;
  successfulExpenseGroupCount = 0;
  exportedCount = 0;
  windowReference: Window;

  constructor(
    private route: ActivatedRoute,
    private taskService: TasksService,
    private expenseGroupService: ExpenseGroupsService,
    private exportsService: ExportsService,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService,
    private windowReferenceService: WindowReferenceService) {
      this.windowReference = this.windowReferenceService.nativeWindow;
    }

  openFailedExports() {
    const that = this;
    this.windowReference.open(`workspaces/${that.workspaceId}/expense_groups?state=FAILED`, '_blank');
  }

  openSuccessfulExports() {
    const that = this;
    this.windowReference.open(`workspaces/${that.workspaceId}/expense_groups?state=COMPLETE`, '_blank');
  }

  checkResultsOfExport(filteredIds: number[]) {
    const that = this;
    const taskType = ['FETCHING_EXPENSE', 'CREATING_BILL', 'CREATING_BANK_TRANSACTION'];
    interval(3000).pipe(
      switchMap(() => from(that.taskService.getAllTasks([], filteredIds, taskType))),
      takeWhile((response) => response.results.filter(task => (task.status === 'IN_PROGRESS' || task.status === 'ENQUEUED')  && task.type !== 'FETCHING_EXPENSES' &&  filteredIds.includes(task.expense_group)).length > 0, true)
    ).subscribe((res) => {
      that.exportedCount = res.results.filter(task => (task.status !== 'IN_PROGRESS' && task.status !== 'ENQUEUED') && task.type !== 'FETCHING_EXPENSES' && filteredIds.includes(task.expense_group)).length;
      if (res.results.filter(task => (task.status === 'IN_PROGRESS' || task.status === 'ENQUEUED')  && task.type !== 'FETCHING_EXPENSES' &&  filteredIds.includes(task.expense_group)).length === 0) {
        that.taskService.getAllTasks(['FAILED', 'FATAL']).subscribe((taskResponse) => {
          that.failedExpenseGroupCount = taskResponse.count;
          that.successfulExpenseGroupCount = filteredIds.length - that.failedExpenseGroupCount;
          that.isExporting = false;
          that.loadExportableExpenseGroups();
          that.snackBar.open('Export Complete');
        });
      }
    });
  }

  createXeroItems() {
    const that = this;
    that.isExporting = true;
    that.settingsService.getGeneralSettings(that.workspaceId).subscribe((settings) => {
      that.generalSettings = settings;
      let allFilteredIds = [];
      const expenseGroupIds = {
        personal: [],
        ccc: [],
      };

      if (that.generalSettings.reimbursable_expenses_object) {
        const filteredIds = that.exportableExpenseGroups.filter(expenseGroup => expenseGroup.fund_source === 'PERSONAL').map(expenseGroup => expenseGroup.id);
        if (filteredIds.length > 0) {
          expenseGroupIds.personal = filteredIds;
          allFilteredIds = allFilteredIds.concat(filteredIds);
        }
      }

      if (that.generalSettings.corporate_credit_card_expenses_object) {
        const filteredIds = that.exportableExpenseGroups.filter(expenseGroup => expenseGroup.fund_source === 'CCC').map(expenseGroup => expenseGroup.id);
        if (filteredIds.length > 0) {
          expenseGroupIds.ccc = filteredIds;
          allFilteredIds = allFilteredIds.concat(filteredIds);
        }
      }

      if (expenseGroupIds.personal.length > 0 || expenseGroupIds.ccc.length > 0) {
          that.exportsService.triggerExports(expenseGroupIds).subscribe(() => {
          that.checkResultsOfExport(allFilteredIds);
        });
      }
    });
  }

  loadExportableExpenseGroups() {
    const that = this;
    that.isLoading = true;
    that.expenseGroupService.getAllExpenseGroups('READY').subscribe((res) => {
      that.exportableExpenseGroups = res.results;
      that.isLoading = false;
    });
  }

  filterOngoingTasks(tasks: TaskResponse) {
    return tasks.results.filter(task => (task.status === 'IN_PROGRESS' || task.status === 'ENQUEUED') && task.type !== 'FETCHING_EXPENSES').length;
  }

  checkOngoingExports() {
    const that = this;

    that.isProcessingExports = true;
    interval(7000).pipe(
      switchMap(() => from(that.taskService.getAllTasks(['IN_PROGRESS', 'ENQUEUED']))),
      takeWhile((response: TaskResponse) => that.filterOngoingTasks(response) > 0, true)
    ).subscribe((tasks: TaskResponse) => {
      that.processingExportsCount = that.filterOngoingTasks(tasks);
      if (that.filterOngoingTasks(tasks) === 0) {
        that.isProcessingExports = false;
        that.loadExportableExpenseGroups();
        that.snackBar.open('Export Complete');
      }
    });
  }

  reset() {
    const that = this;

    that.isExporting = false;
    that.isLoading = true;

    that.taskService.getAllTasks(['IN_PROGRESS', 'ENQUEUED']).subscribe((tasks: TaskResponse) => {
      that.isLoading = false;
      if (that.filterOngoingTasks(tasks) === 0) {
        that.loadExportableExpenseGroups();
      } else {
        that.processingExportsCount = that.filterOngoingTasks(tasks);
        that.checkOngoingExports();
      }
    });
  }

  ngOnInit() {
    const that = this;

    that.isExporting = false;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;

    that.reset();
  }

}
