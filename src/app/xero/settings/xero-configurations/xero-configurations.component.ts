import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-xero-configurations',
  templateUrl: './xero-configurations.component.html',
  styleUrls: ['./xero-configurations.component.scss', '../../xero.component.scss']
})
export class XeroConfigurationsComponent implements OnInit {

  state: string;
  workspaceId: number;
  isParentLoading: boolean;
  fyleFields: any;
  generalSettings: any;
  xeroConnectionDone: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private mappingsService: MappingsService, private settingsService: SettingsService) { }

  changeState(state) {
    const that = this;
    if (that.state === 'GENERAL') {
      that.state = state;
      that.router.navigate([`workspaces/${that.workspaceId}/settings/configurations/${that.state.toLowerCase()}`]);
    }
    if (that.state === 'TENANT') {
      that.state = state;
      that.router.navigate([`workspaces/${that.workspaceId}/settings/configurations/${that.state.toLowerCase()}`]);
    }
    if (that.state === 'EXPENSE_FIELDS') {
      that.state = state;
      that.router.navigate([`workspaces/${that.workspaceId}/settings/configurations/${that.state.toLowerCase()}`]);
    }
  }

  showExpenseFields() {
    const that = this;

    if (that.fyleFields && that.fyleFields.length && that.generalSettings) {
      return true;
    }

    return false;
  }

  ngOnInit() {
    const that = this;

    that.isParentLoading = true;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
    that.state = that.route.snapshot.firstChild.routeConfig.path.toUpperCase() || 'TENANT';

    that.settingsService.getXeroCredentials(that.workspaceId).subscribe(credentials => {
      if (credentials) {
        that.xeroConnectionDone = true;
      }
      forkJoin(
        [
          that.mappingsService.getFyleExpenseFields(),
          that.settingsService.getGeneralSettings(that.workspaceId),
        ]
      ).subscribe(response => {
        that.fyleFields = response[0];
        that.generalSettings = response[1];
        that.isParentLoading = false;
      }, () => {
        that.isParentLoading = false;
      });

    });
  }
}
