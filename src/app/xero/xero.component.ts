import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { WorkspaceService } from '../core/services/workspace.service';
import { SettingsService } from '../core/services/settings.service';
import { StorageService } from '../core/services/storage.service';
import { WindowReferenceService } from '../core/services/window.service';

@Component({
  selector: 'app-xero',
  templateUrl: './xero.component.html',
  styleUrls: ['./xero.component.scss']
})
export class XeroComponent implements OnInit {
  user: any;
  orgsCount: number;
  workspace: any = {};
  isLoading = true;
  fyleConnected = false;
  xeroConnected = false;
  generalSettings: any;
  mappingSettings: any;
  showSwitchOrg = false;
  navDisabled = true;
  windowReference: Window;

  constructor(
    private workspaceService: WorkspaceService,
    private settingsService: SettingsService,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private windowReferenceService: WindowReferenceService) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }

  getGeneralSettings() {
    const that = this;
    that.settingsService.getMappingSettings(that.workspace.id).subscribe((response) => {
      // TODO: employee, category, extra fields - arrange in this order
      that.mappingSettings = response.results;
      that.isLoading = false;
    }, () => {
      that.isLoading = false;
    });
  }

  switchWorkspace() {
    this.authService.switchWorkspace();
  }

  getSettingsAndNavigate() {
    const that = this;
    const pathName = that.windowReference.location.pathname;
    that.storageService.set('workspaceId', that.workspace.id);
    if (pathName === '/workspaces') {
      that.router.navigateByUrl(`/workspaces/${that.workspace.id}/dashboard`);
    }
    that.getGeneralSettings();
    that.setupAccessiblePathWatchers();
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
      const onboarded = that.storageService.get('onboarded');
      if (onboarded !== true) {
        that.getConfigurations().then(() => {
          that.navDisabled = false;
        }).catch(() => {
          // do nothing
        });
      }
    });
  }

  setupWorkspace() {
    const that = this;
    that.user = that.authService.getUser();
    that.workspaceService.getWorkspaces(that.user.org_id).subscribe(workspaces => {
      if (Array.isArray(workspaces) && workspaces.length > 0) {
        that.workspace = workspaces[0];
        that.getSettingsAndNavigate();
      } else {
        that.workspaceService.createWorkspace().subscribe(workspace => {
          that.workspace = workspace;
          that.getSettingsAndNavigate();
        });
      }
    });
  }

  getXeroCredentials() {
    const that = this
    const workspaceId = this.storageService.get('workspaceId');
    if(workspaceId) {
      that.settingsService.getXeroCredentials(workspaceId).subscribe(credentials => {
        if (credentials) {
          that.xeroConnected = true;
        }
      })
    }
  }

  ngOnInit() {
    const that = this;
    const onboarded = that.storageService.get('onboarded');
    that.navDisabled = onboarded !== true;
    that.orgsCount = that.authService.getOrgCount();
    that.setupWorkspace();
    that.getXeroCredentials()
  }
}