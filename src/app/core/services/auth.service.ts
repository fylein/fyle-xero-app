import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Token } from '../models/tokens';

import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/core/services/api.service';
import { StorageService } from './storage.service';
import { WindowReferenceService } from './window.service';
import { UserProfile } from '../models/user-profile.model';
import { Organization } from '../models/organization.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

const API_BASE_URL = environment.api_url;
const FYLE_URL = environment.fyle_url;
const FYLE_CLIENT_ID = environment.fyle_client_id;
const CALLBACK_URI = environment.callback_uri;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  windowReference: Window;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private storageService: StorageService,
    private windowReferenceService: WindowReferenceService) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${JSON.stringify(error.error)}`
      );
    }
    return throwError(error);
  }

  login(code: string): Observable<Token> {
    return this.http
      .post<Token>(
        API_BASE_URL + '/auth/login/',
        {
          code,
        },
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAccessToken(refreshToken: string): Observable<Token> {
    return this.http
      .post<Token>(
        API_BASE_URL + '/auth/refresh/',
        {
          refresh_token: refreshToken,
        },
        httpOptions
      )
      .pipe(
        catchError(
          this.handleError
        )
      );
  }

  isLoggedIn() {
    return this.storageService.get('access_token') !== null;
  }

  getUser() {
    return this.storageService.get('user');
  }

  getOrgCount() {
    return this.storageService.get('orgsCount');
  }

  getUserProfile(): Observable<UserProfile> {
    return this.apiService.get('/user/profile/', {});
  }

  getClusterDomain(): Observable<string> {
    return this.apiService.get(`/user/domain/`, {});
  }

  getFyleOrgs(): Observable<Organization[]> {
    return this.apiService.get(`/user/orgs/`, {});
  }

  logout() {
    this.storageService.clear();
  }

  redirectToLogin() {
    this.windowReference.location.href = FYLE_URL +
      '/app/developers/#/oauth/authorize?' +
      'client_id=' +
      FYLE_CLIENT_ID +
      '&redirect_uri=' +
      CALLBACK_URI +
      '&response_type=code';
  }

  switchWorkspace() {
    this.logout();
    this.redirectToLogin();
  }
}
