import { Component, OnInit } from '@angular/core';
import { MinimalPatchWorkspace } from 'src/app/core/models/workspace.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { WindowReferenceService } from 'src/app/core/services/window.service';
import { WorkspaceService } from 'src/app/core/services/workspace.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

  windowReference: Window;

  orgsCount: number;

  constructor(
    private workspaceService: WorkspaceService,
    private authService: AuthService,
    private storageService: StorageService,
    private windowReferenceService: WindowReferenceService,
  ) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }

  switchToNewApp(workspace: MinimalPatchWorkspace | void): void {
    if (!workspace) {
      workspace = {
        app_version: 'v2',
        onboarding_state: 'COMPLETE'
      };
    }

    this.workspaceService.patchWorkspace(workspace).subscribe(() => {
      this.redirectToNewApp();
    });
  }

  private redirectToNewApp(): void {
    const user = this.authService.getUser();

    const localStorageDump = {
      user: {
        email: user.employee_email,
        access_token: this.storageService.get('access_token'),
        refresh_token: this.storageService.get('refresh_token'),
        full_name: user.full_name,
        user_id: user.user_id,
        org_id: user.org_id,
        org_name: user.org_name
      },
      orgsCount: this.orgsCount
    };

    this.windowReference.location.href = `${environment.new_xero_app_url}?local_storage_dump=${encodeURIComponent(JSON.stringify(localStorageDump))}`;
  }

  ngOnInit() {
    this.orgsCount = this.authService.getOrgCount();
    this.switchToNewApp({app_version: 'v2'});
  }

}
