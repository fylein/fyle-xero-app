import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError as observableThrowError, from } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { catchError, mergeMap } from 'rxjs/internal/operators';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService) { }

  refreshAccessToken = () => {
    const that = this;
    // this should call auth service to get a new access token with a refresh token
    const refreshToken = that.storageService.get('refresh_token');
    // TODO: remove promises and do with rxjs observables
    return that.authService.getAccessToken(refreshToken).toPromise().then((token) => {
      that.storageService.set('access_token', token.access_token);
      return token;
    });
  }
  // Having any here is ok, since this is used on all requests
  addToken(request: HttpRequest<any>): HttpRequest<any> {
    if (this.authService.isLoggedIn()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.storageService.get('access_token')}`
        }
      });
    }
    return request;
  }

  // Having any here is ok, since this is used on all requests
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const that = this;
    request = that.addToken(request);

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 403) {
          return from(that.refreshAccessToken()).pipe(mergeMap(() => {
            request = that.addToken(request);
            return next.handle(request);
          }));
        }
        return observableThrowError(error);
      })
    );
  }

  logoutUser() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

}
