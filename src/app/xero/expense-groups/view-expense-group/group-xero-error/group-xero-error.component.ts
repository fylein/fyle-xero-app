import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TasksService } from 'src/app/core/services/tasks.service';
import { ActivatedRoute } from '@angular/router';
import { Task } from 'src/app/core/models/task.model';
import { XeroValidationError } from 'src/app/core/models/xero-validation-error.model';

@Component({
  selector: 'app-group-xero-error',
  templateUrl: './group-xero-error.component.html',
  styleUrls: ['./group-xero-error.component.scss', '../../../xero.component.scss']
})
export class GroupXeroErrorComponent implements OnInit {

  isLoading = false;
  expenseGroupId: number;
  workspaceId: number;
  task: Task;
  count: number;

  xeroErrors: MatTableDataSource<XeroValidationError> = new MatTableDataSource([]);
  columnsToDisplay = ['error', 'message'];

  constructor(private taskService: TasksService, private route: ActivatedRoute) { }

  getType(name: string) {
    return name.replace(/_/g, ' ');
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.snapshot.parent.params.workspace_id;
    that.expenseGroupId = +that.route.snapshot.parent.params.expense_group_id;
    that.isLoading = true;
    that.taskService.getTasksByExpenseGroupId(that.expenseGroupId).subscribe((res: Task[]) => {
      that.xeroErrors = new MatTableDataSource(res.map(task => task.xero_errors[0].error.Elements[0].ValidationErrors).reduce((arr1, arr2) => arr1.concat(arr2)));
      that.count = res[0].xero_errors && res[0].xero_errors.length;
      that.task = res[0];
      that.isLoading = false;
    });
  }
}
