import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { forkJoin } from 'rxjs';
import { StorageService } from 'src/app/core/services/storage.service';
import { WindowReferenceService } from 'src/app/core/services/window.service';


@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit {
  windowReference: Window;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private storageService: StorageService,
              private windowReferenceService: WindowReferenceService) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }

  logout() {
    const that = this;
    that.router.navigate(['auth/login']).then(() => {
      that.windowReference.location.reload();
    });
  }

  ngOnInit() {
    const that = this;
    if (that.authService.isLoggedIn()) {
      that.authService.logout();
    }
    that.route.queryParams.subscribe(params => {
      if (params.code) {
        that.authService.login(params.code).subscribe(
          response => {
            that.storageService.set('email', response.user.email);
            that.storageService.set('access_token', response.access_token);
            that.storageService.set('refresh_token', response.refresh_token);
            forkJoin([
              that.authService.getUserProfile(),
              that.authService.getClusterDomain(),
              that.authService.getFyleOrgs()
            ]).subscribe(responses => {
              that.storageService.set('user', responses[0]);
              that.storageService.set('clusterDomain', responses[1]);
              that.storageService.set('orgsCount', responses[2].length);
              that.router.navigate(['/workspaces']);
            });
          },
          error => {
            that.router.navigate(['auth/login']).then(() => {
              that.windowReference.location.reload();
            });
            that.logout();
          }
        );
      } else if (params.error) {
        that.router.navigate(['auth/login']).then(() => {
          that.windowReference.location.reload();
          that.logout();
        });
      }
    });
  }
}
