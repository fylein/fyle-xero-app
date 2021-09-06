import {
  HttpClient,
  HttpErrorResponse,  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

const API_BASE_URL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse, httpType: string) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      if (error.status >= 500 && httpType === 'GET') {
        console.error(
          `Backend returned code ${error.status}, ` + `body was: ` + JSON.stringify(error.error)
        );
      }
      if (error.status >= 400 && httpType === 'POST') {
        console.error(
          `Backend returned code ${error.status}, ` + `body was: ` + JSON.stringify(error.error)
        );
      }
    }
    return throwError(error);
  }
  // Having any here is ok
  post(endpoint: string, body: {}): Observable<any> {
    return this.http
      .post(
        API_BASE_URL + endpoint,
        body,
        httpOptions
      )
      .pipe(catchError(error => {
        return this.handleError(error, 'POST');
      }));
  }
  // Having any here is ok
  get(endpoint: string, apiParams: {}): Observable<any> {
    let params = new HttpParams();
    Object.keys(apiParams).forEach(key => {
      params = params.set(key, apiParams[key]);
    });

    return this.http.get(
        API_BASE_URL + endpoint,
        {params}
      )
      .pipe(catchError(error => {
        return this.handleError(error, 'GET');
      }));
  }
}
