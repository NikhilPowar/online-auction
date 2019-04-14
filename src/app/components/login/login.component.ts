import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  emailPattern: string;
  passwordPattern: string;
  loginError: string;
  hasLoginError: boolean;
  myForm: FormGroup;

  constructor(
    fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.hasLoginError = false;
    this.emailPattern = '^[a-z0-9_]*@[a-z]*([.][a-z]{2,3})+$';
    this.passwordPattern = '^[a-zA-Z0-9_#@%$*]+$';
    this.myForm = fb.group({
      'Email': ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      'Password': ['', [Validators.required, Validators.pattern(this.passwordPattern)]]
    });

    userService.UserObservable.subscribe(data => {
        if (data && data.uid) {
          console.log('Logged in');
          this.router.navigate(['/Home']);
        }
    });
  }

  setLoginError(error: string): void {
    this.loginError = error;
    this.hasLoginError = true;
  }

  onSubmit(value: any): void {
    this.hasLoginError = false;
    if (!this.myForm.valid) {
      console.log('Form Not Valid');
      this.setLoginError('Please fill form correctly');
      return;
    }
    console.log('you submitted value: ', value);
    this.userService.firebaseLogin(value).then(response => {
      if (response.code === 'auth/user-not-found') {
        this.setLoginError('User does not exist. Please register first or try another user');
      } else if (response.code === 'auth/wrong-password') {
        this.setLoginError('Incorrect password! Please check your password');
      }
    });
  }

  ngOnInit() {
  }
}
