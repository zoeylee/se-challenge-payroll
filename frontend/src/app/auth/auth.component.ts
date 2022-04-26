import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../providers/services/user.service';
import { APIErrors } from '../providers/models/errors.model'
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public authType: String = '';
  public productName: String = 'Payroll';
  public errors: APIErrors = {
    nonFieldErrors: {}
  };
  public isSubmitting = false;
  public authForm: FormGroup;
  public username: AbstractControl;
  public password: AbstractControl;

  authenticated: boolean = false;
  loading = false;
  returnUrl: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.authForm = this.fb.group({
      'username': ['', [Validators.required, Validators.minLength(4)]],
      'password': ['', [Validators.required, Validators.minLength(8)]]
    });
    this.username = this.authForm.controls['username'];
    this.password = this.authForm.controls['password'];

  }

  public currentUser: any;

  message:string = '';


  ngOnInit() {
        this.userService.isAuthenticated().pipe().subscribe((res) => {
            if (res) {
                this.router.navigateByUrl('/pages/report-list');
            }
        })
  }

  selectedUserEventHandler(user: any) {
    this.authenticated = true;
  }



  submitForm() {
    if(!this.username.value || !this.password.value) {
        return;
    }
    if (this.username.hasError('minlength') || this.password.hasError('minlength') || this.loading ) {
        return;
    }

    this.isSubmitting = true;
    this.loading = true;
    this.errors = {
        nonFieldErrors: {}
    };
    const credentials = this.authForm.value;
    this.userService.login(credentials).subscribe(
      () => {
        this.router.navigateByUrl('/pages/report-list');
      },
      (err: any) => {
        this.errors = err;
        console.log(err)
        this.isSubmitting = false;
        this.loading = false;
      }
    );
  }

}
