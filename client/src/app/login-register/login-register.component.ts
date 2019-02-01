import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormGroupDirective, NgForm, FormControl } from '@angular/forms';
import { MatTabChangeEvent, MatSnackBar } from '@angular/material';
import { AuthenticationService } from '../core/services/authentication.service';
import { UserType } from '../core/models/User';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

enum Tabs {
  LOGIN = 0,
  REGISTER = 1
}

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {

  userType: string;

  loginFields: FormGroup;
  registerFields: FormGroup;
  selectedTab: number;

  constructor(private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    // default values
    this.selectedTab = 0;
    this.userType = UserType.STUDENT;

    this.loginFields = this.fb.group({
      loginUsername: new FormControl('', Validators.required),
      loginPassword: new FormControl('', Validators.required),
    });

    this.registerFields = this.fb.group({
      registerUsername: new FormControl('', Validators.required),
      registerPassword: new FormControl('', Validators.required),
      registerSecondPassword: new FormControl('', Validators.required),
      registerEmail: new FormControl('', Validators.compose([Validators.required,
      Validators.email
      /* Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$') */]))
    });
  }

  getErrorUsername() {
    return 'You must enter a username';
  }

  getErrorPassword() {
    return 'You must enter a password';
  }

  onLogin() {
    if (!this.loginFields.valid || this.loginFields.value.loginUsername === ''
      || this.loginFields.value.loginPassword === '') {
      console.log('Error login');
    } else {
      // good input
      switch (this.userType) {
        case UserType.STUDENT: {
          console.log('student log in');
          console.log(this.loginFields.value);
          this.authenticationService.loginStudent(
            {
              password: this.loginFields.value.loginPassword,
              username: this.loginFields.value.loginUsername
            })
            .subscribe(seat => {
              this.router.navigate(['/search']);
            });
        }
          break;
        case UserType.SCHOOL_STAFF: {
          console.log('school staff log in');
          this.authenticationService.loginSchoolStaff(
            {
              password: this.loginFields.value.loginPassword,
              username: this.loginFields.value.loginUsername
            })
            .subscribe(seat => {
              this.router.navigate(['/search']);
            });
        }
          break;
      }
    }
  }

  setTabActive(event: MatTabChangeEvent): void {
    this.selectedTab = event.index;
  }

  changeUserType(value: string) {
    this.userType = value;
  }

  register(tabReference: any) {

    if (!this.registerFields.valid || this.registerFields.value.registerUsername === '' ||
      this.registerFields.value.registerUsername === ''
      || this.registerFields.value.registerPassword === ''
      || this.registerFields.value.registerPassword !== this.registerFields.value.registerSecondPassword) {
      console.log('Register error');
    } else {
      this.authenticationService.register(
        {
          email: this.registerFields.value.registerEmail,
          password: this.registerFields.value.registerPassword,
          username: this.registerFields.value.registerUsername
        })
        .subscribe(() => {
          tabReference.selectedIndex = 0;
          this.snackBar.open('Student registered successfully', null,
            { duration: 3000 });
        });
    }
  }

  keyDownFunction(event) {
  if(event.keyCode == 13) {
    this.onLogin();
    // rest of your code
  }
}

}
