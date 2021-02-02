import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SettingsService } from '../services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from '../services/storage.service';
import { WorkspaceService } from '../services/workspace.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspacesGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
    private router: Router,
    private snackBar: MatSnackBar,
    private storageService: StorageService,
    private workspaceService: WorkspaceService
    ) { }

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
        this.settingsService.getOrganisations(workspaceId)
      ]
    ).pipe(
      map(response => !!response),
      catchError(error => {
        const that = this;

        if (error.status === 400 && error.error.message === 'Xero connection expired') {
          that.settingsService.deleteXeroCredentials(workspaceId).subscribe(() => {
            that.authService.logout();
            that.authService.redirectToLogin();
          });
        }
        const onboarded = that.storageService.get('onboarded');
        if (!onboarded) {
          that.snackBar.open('You cannot access this page yet. Please follow the onboarding steps in the dashboard');
          return;
        }

        return that.router.navigateByUrl(`workspaces/${workspaceId}/dashboard`).then((res) => {
          that.snackBar.open('You cannot access this page yet. Please follow the onboarding steps in the dashboard');
          return res;
        });
      })
    );
  }
}
