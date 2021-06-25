import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SettingsService } from '../services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from '../services/storage.service';
import { WorkspaceService } from '../services/workspace.service';
import { AuthService } from '../services/auth.service';
import { WindowReferenceService } from '../../core/services/window.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspacesGuard implements CanActivate {

  windowReference: Window;

  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
    private router: Router,
    private snackBar: MatSnackBar,
    private storageService: StorageService,
    private workspaceService: WorkspaceService,
    private windowReferenceService: WindowReferenceService
    ) {
      this.windowReference = this.windowReferenceService.nativeWindow;
    }

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const workspaceId = +this.workspaceService.getWorkspaceId();

    if (!workspaceId) {
      return this.router.navigateByUrl(`workspaces/${workspaceId}/dashboard`);
    }

    return forkJoin(
      [
        this.settingsService.getFyleCredentials(workspaceId),
        this.settingsService.getXeroCredentials(workspaceId),
        this.settingsService.getGeneralSettings(workspaceId),
        this.settingsService.getXeroTokenHealth(workspaceId)
      ]
    ).pipe(
      map(response => !!response),
      catchError(error => {
        const that = this;

        if (error.status === 400 && error.error.message === 'Xero connection expired') {
          that.settingsService.deleteXeroCredentials(workspaceId).subscribe(() => {
            that.storageService.set('onboarded', false);
            that.snackBar.open('Xero token expired, please connect Xero account again');
            setTimeout(() => {
              that.router.navigateByUrl(`workspaces/${workspaceId}/dashboard`).then(() => {
                that.windowReference.location.reload();
              });
            }, 3000);
          });
        }
        const onboarded = that.storageService.get('onboarded');
        const snackBarText = 'You cannot access this page yet. Please follow the onboarding steps in the dashboard or refresh your page';
        if (!onboarded) {
          that.snackBar.open(snackBarText);
          return;
        }

        return that.router.navigateByUrl(`workspaces/${workspaceId}/dashboard`).then((res) => {
          that.snackBar.open(snackBarText);
          return res;
        });
      })
    );
  }
}
