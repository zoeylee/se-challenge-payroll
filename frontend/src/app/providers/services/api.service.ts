import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


type APIMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
type APIParams = any;
type APIBody = any;
type APIHeaders =
    | HttpHeaders
    | {
          [header: string]: string | string[];
      };
type APIErrorStatus = number | '*';
type APIErrorStatusMap = {
  [status in APIErrorStatus]?: string;
};

@Injectable()
export class ApiService {
  baseUrl: string = `${environment.apiUrl}/${environment.apiPrefix}/${environment.apiVersion}`;

  constructor(
    private httpClient: HttpClient
  ) {

  }

  private formatErrors(error: any) {
    return  throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.request('GET', path, params).pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.request('PUT', path, body).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.request('POST', path, body).pipe(catchError(this.formatErrors));
  }

  delete(path: any): Observable<any> {
    return this.request('DELETE', path).pipe(catchError(this.formatErrors));
  }

  request(
      method: APIMethod,
      url: string,
      body?: APIBody,
      options?: { params?: APIParams; headers?: APIHeaders },
      errorMap: APIErrorStatusMap = {}
  ): Observable<any> {
      const httpOptions: any = {
          responseType: 'json',
      };
      if (body) {
          httpOptions.body = body;
      }
      if (options) {
          if (options.params) {
              httpOptions.params = new HttpParams({
                  fromObject: options.params,
              });
          }
          if (options.headers) {
              httpOptions.headers = options.headers;
          }
      }
      return this.httpClient
          .request(method, this.createUrl(url), httpOptions)
          .pipe();
  }

  private createUrl(relativeUrl: string): string {
    return this.baseUrl + relativeUrl;
  }

}