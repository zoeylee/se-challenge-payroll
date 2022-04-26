import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { User } from '../providers/models/user.model';
import { UserService } from '../providers/services/user.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
    isAuthenticated = false;
    currentUser: User | null;

    constructor(private userService: UserService, private router: Router) { }

    ngOnInit(): void {
        this.getCurrent();
    }

    getCurrent(): void {
        const value = window.localStorage.getItem('currentUser') as string;
        this.currentUser = JSON.parse(value) as User;
        if(!_.isNull(this.currentUser) && !_.isUndefined(this.currentUser)) {
            let expire = this.currentUser.exp * 1000;
            this.isAuth(expire);
        }
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

    onLogout(): void{
        this.currentUser = null;
        this.isAuthenticated = false;
        this.userService.logout();
        this.router.navigate(['']);
    }
}
