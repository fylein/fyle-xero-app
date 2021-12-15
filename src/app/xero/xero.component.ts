import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { WorkspaceService } from '../core/services/workspace.service';
import { SettingsService } from '../core/services/settings.service';
import { StorageService } from '../core/services/storage.service';
import { WindowReferenceService } from '../core/services/window.service';
import { Workspace } from '../core/models/workspace.model';
import { GeneralSetting } from '../core/models/general-setting.model';
import { MappingSetting } from '../core/models/mapping-setting.model';
import { MappingsService } from '../core/services/mappings.service';
import { MatSnackBar } from '@angular/material';
import { UserProfile } from '../core/models/user-profile.model';
import { TrackingService } from '../core/services/tracking.service';
import * as Sentry from '@sentry/angular';

@Component({
  selector: 'app-xero',
  templateUrl: './xero.component.html',
  styleUrls: ['./xero.component.scss']
})
export class XeroComponent implements OnInit {
  user: {
    employee_email: string,
    full_name: string,
    org_id: string,
    org_name: string
  };
  orgsCount: number;
  workspace: Workspace;
  isLoading = true;
  fyleConnected = false;
  xeroConnected = false;
  showGeneralmappings = true;
  generalSettings: GeneralSetting;
  mappingSettings: MappingSetting[];
  showSwitchOrg = false;
  showRefreshIcon: boolean;
  navDisabled = true;
  windowReference: Window;

  constructor(
    private workspaceService: WorkspaceService,
    private settingsService: SettingsService,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private windowReferenceService: WindowReferenceService,
    private trackingService: TrackingService,
    private snackBar: MatSnackBar,
    private mappingsService: MappingsService,
    ) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }

  refreshDashboardMappingSettings(mappingSettings: MappingSetting[]) {
    const that = this;

    that.mappingSettings = mappingSettings.filter(
      setting => (setting.source_field !== 'EMPLOYEE' && setting.source_field !== 'CATEGORY')
    );
    that.isLoading = false;
  }

  getGeneralSettings() {
    const that = this;
    that.settingsService.getMappingSettings(that.workspace.id).subscribe((response) => {
      that.mappingSettings = response.results.filter(
        setting => (setting.source_field !== 'EMPLOYEE' && setting.source_field !== 'CATEGORY')
      );
      that.isLoading = false;
    }, () => {
      that.isLoading = false;
    });
  }

  switchWorkspace() {
    this.authService.switchWorkspace();
    this.trackingService.onSwitchWorkspace();
    Sentry.configureScope(scope => scope.setUser(null));
  }

  getSettingsAndNavigate() {
    const that = this;
    that.getGeneralSettings();
    that.setupAccessiblePathWatchers();
    const pathName = that.windowReference.location.pathname;
    that.storageService.set('workspaceId', that.workspace.id);
    if (pathName === '/workspaces') {
      that.router.navigateByUrl(`/workspaces/${that.workspace.id}/dashboard`);
    }
  }

  getTitle(name: string) {
    return name.replace(/_/g, ' ');
  }

  getConfigurations() {
    const that = this;

    return forkJoin(
      [
        that.settingsService.getGeneralSettings(that.workspace.id),
        that.settingsService.getMappingSettings(that.workspace.id)
      ]
    ).toPromise();
  }

  setupAccessiblePathWatchers() {
    const that = this;
    that.getConfigurations().then(() => {
      that.navDisabled = false;
    }).catch(() => {
      // do nothing
    });

    that.router.events.subscribe(() => {
      that.getConfigurations().then((results) => {
        if (!results[0].corporate_credit_card_expenses_object && !results[0].sync_fyle_to_xero_payments) {
          that.showGeneralmappings = false;
        }
        that.navDisabled = false;
      });
    });
  }

  setupWorkspace() {
    const that = this;
    that.user = that.authService.getUser();
    that.workspaceService.getWorkspaces(that.user.org_id).subscribe(workspaces => {
      if (Array.isArray(workspaces) && workspaces.length > 0) {
        that.workspace = workspaces[0];
        that.storageService.set('workspace', workspaces[0]);
        that.setUserIdentity(that.user.employee_email, workspaces[0].id, {fullName: that.user.full_name});
        that.getSettingsAndNavigate();
      } else {
        that.workspaceService.createWorkspace().subscribe(workspace => {
          that.workspace = workspace;
          that.storageService.set('workspace', workspace);
          that.setUserIdentity(that.user.employee_email, workspace.id, {fullName: that.user.full_name});
          that.getSettingsAndNavigate();
        });
      }
    });
  }

  setUserIdentity(email: string, workspaceId: number, properties) {
    Sentry.setUser({
      email,
      workspaceId,
    });
    this.trackingService.onSignIn(email, workspaceId, properties);
  }

  onSignOut() {
    Sentry.configureScope(scope => scope.setUser(null));
    this.trackingService.onSignOut();
  }

  onSelectTenantPageVisit() {
    this.trackingService.onPageVisit('Select Tenant');
  }

  onConfigurationsPageVisit() {
    this.trackingService.onPageVisit('Configurations');
  }

  onGeneralMappingsPageVisit() {
    this.trackingService.onPageVisit('Genral Mappings');
  }

  onEmployeeMappingsPageVisit() {
    this.trackingService.onPageVisit('Employee Mappings');
  }

  onCategoryMappingsPageVisit() {
    this.trackingService.onPageVisit('Category Mappings');
  }

  getXeroCredentials() {
    const that = this;
    const workspaceId = this.storageService.get('workspaceId');
    if (workspaceId) {
      that.settingsService.getXeroCredentials(workspaceId).subscribe(credentials => {
        if (credentials) {
          that.xeroConnected = true;
        }
      });
    }
  }

  syncDimension() {
    const that = this;
    that.mappingsService.refreshDimension();
    that.snackBar.open('Refreshing Fyle and Xero Data');
  }

  hideRefreshIconVisibility() {
    this.showRefreshIcon = false;
  }

  ngOnInit() {
    const that = this;
    const onboarded = that.storageService.get('onboarded');
    that.showRefreshIcon = !onboarded;
    that.navDisabled = onboarded !== true;
    that.orgsCount = that.authService.getOrgCount();
    that.setupWorkspace();
    that.getXeroCredentials();
  }
}
