import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TasksService } from 'src/app/core/services/tasks.service';
import { ActivatedRoute } from '@angular/router';
import { Task } from 'src/app/core/models/task.model';
import { MappingError } from 'src/app/core/models/mapping-error.model';

@Component({
  selector: 'app-group-mapping-error',
  templateUrl: './group-mapping-error.component.html',
  styleUrls: ['./group-mapping-error.component.scss', '../../../xero.component.scss']
})
export class GroupMappingErrorComponent implements OnInit {

  isLoading = false;
  expenseGroupId: number;
  workspaceId: number;

  mappingErrors: MatTableDataSource<MappingError> = new MatTableDataSource([]);
  columnsToDisplay = ['category', 'message', 'type'];

  constructor(private taskService: TasksService, private route: ActivatedRoute) { }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.snapshot.parent.params.workspace_id;
    that.expenseGroupId = +that.route.snapshot.parent.params.expense_group_id;
    that.isLoading = true;
    that.taskService.getTasksByExpenseGroupId(that.expenseGroupId).subscribe((res: Task[]) => {
      that.mappingErrors = new MatTableDataSource(res.map(task => task.detail).reduce((arr1, arr2) => arr1.concat(arr2)));
      that.isLoading = false;
    });
  }
}
