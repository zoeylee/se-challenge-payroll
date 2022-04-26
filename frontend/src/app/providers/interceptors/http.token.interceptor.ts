import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

import { JwtService } from '../services/jwt.service';
import { environment } from '@env/environment';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService) {}
  
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
): Observable<HttpEvent<any>> {
    // Filter requests to external providers
    if (request.url.startsWith(environment.apiUrl)) {
        // Set authentication headers
        const token = this.jwtService.getToken();

        if (token) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });
        }
        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401 || err.status === 403) {
                    // todo, remove token
                }
                return throwError(err);
            }),
            tap(() => {})
        );
    }
    return next.handle(request);
}
}