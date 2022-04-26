import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';


@Injectable()
export class UserService {


  constructor (
    private apiService: ApiService,
    private jwtService: JwtService
  ) {}

  populate() {
    if (this.jwtService.getToken()) {
      this.apiService.get('/user.json')
      .subscribe(
        data => this.setAuth(data.user),
        err => this.purgeAuth()
      );
    } else {
      this.purgeAuth();
    }
  }

  setAuth(user: User) {
    this.jwtService.saveToken(user.token);
  }

  purgeAuth() {
    this.jwtService.destroyToken();
  }

  login(credentials: any): Observable<any> {
    return this.apiService.post('/auth', credentials).pipe(map(
      data => {
        if (data.token) {
          const base64Url = data.token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const user: User = JSON.parse(window.atob(base64));
          user.token = data.token;
          if (user && user.token) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.setAuth(user);
          }
          return user;
        }
        return null;
      }
    ));
  }


  logout() {
    localStorage.removeItem('currentUser');
    this.purgeAuth();
  }

  isAuthenticated(): Observable<boolean | string> {
    const token = this.jwtService.getToken();
    if (!token) {
        // No token - no point to continue
        return of(false);
    }
    return of(true);
  }

}
