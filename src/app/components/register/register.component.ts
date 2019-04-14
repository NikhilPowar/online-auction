import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserTypeArr, UserType } from '../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  myForm: FormGroup;
  userTypeArr = UserTypeArr;
  userType = UserType;
  firstNamePattern: string;
  lastNamePattern: string;
  emailPattern: string;
  passwordPattern: string;
  locationPattern: string;
  registerError: string;
  hasRegisterError: boolean;

  constructor(
    fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.hasRegisterError = false;
    this.firstNamePattern = '^[A-Z][a-zA-Z ]*$';
    this.lastNamePattern = '^[A-Z][a-zA-Z ]*$';
    this.emailPattern = '^[a-z0-9_]*@[a-z]*([.][a-z]{2,3})+$';
    this.passwordPattern = '^[a-zA-Z0-9_#@%$*]+$';
    this.locationPattern = '^[A-Z][a-zA-Z ]*$';

    this.myForm = fb.group({
      'FirstName': ['', [Validators.required, Validators.pattern(this.firstNamePattern)]],
      'LastName': ['', [Validators.required, Validators.pattern(this.lastNamePattern)]],
      'Email': ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      'Password': ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      'Location': ['', [Validators.required, Validators.pattern(this.locationPattern)]],
      'AccountType': ['User', Validators.required],
    });

    userService.UserObservable.subscribe(data => {
      if (data && data.uid) {
        console.log('Registration successful');
        this.router.navigate(['/Home']);
      }
    });
  }

  setRegisterError(error: string): void {
    this.registerError = error;
    this.hasRegisterError = true;
  }

  onSubmit(value: any): void {
    this.hasRegisterError = false;
    if (!this.myForm.valid) {
      console.log('Form Not Valid');
      this.setRegisterError('Please fill form correctly');
      return;
    }
    console.log('you submitted value: ', value);
    this.userService.firebaseCreateUser(value);
  }

  ngOnInit() {
  }

}
