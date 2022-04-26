import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from './providers/services/user.service';
import { User } from './providers/models/user.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  public currentUser: User = {} as User;
  public isAuthenticated: boolean = false;

  constructor(public userService: UserService, private router: Router) {
    
    
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.getCurrent();
      }
    });
  }

  getCurrent() {
    const current  = localStorage.getItem('currentUser') as string;
    this.currentUser = JSON.parse(current);
    if(!_.isNull(this.currentUser) && !_.isUndefined(this.currentUser)) {
      let expire = this.currentUser.exp * 1000;
      this.isAuth(expire);
    }
  }

  onLogout() {
    this.currentUser = {} as User;
    this.isAuthenticated = false;
    this.userService.logout();
    this.router.navigate(['']);
  }

  isAuth(exp: number) {
    let today = new Date();
    let now = today.getTime();
    if(exp > now) {
      this.isAuthenticated = true;
    }
    else {
      this.isAuthenticated = false;
      this.router.navigate(['']);
    }
  }
}
