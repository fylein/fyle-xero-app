import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sync-export',
  templateUrl: './sync-export.component.html',
  styleUrls: ['./sync-export.component.scss', '../xero.component.scss']
})
export class SyncExportComponent implements OnInit {

  state: string;
  workspaceId: number;

  constructor(private route: ActivatedRoute, private router: Router) { }

  changeState(state) {
    const that = this;
    if (that.state !== state) {
      that.state = state;
      that.router.navigate([`workspaces/${that.workspaceId}/sync_export/${that.state.toLowerCase()}`]);
    }
  }

  ngOnInit() {
    this.state = this.route.snapshot.firstChild.routeConfig.path.toUpperCase() || 'SYNC';
    this.workspaceId = +this.route.snapshot.params.workspace_id;
  }

}
