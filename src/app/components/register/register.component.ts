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
  constructor(
    fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {

    this.myForm = fb.group({
      'FirstName': ['', Validators.required],
      'LastName': ['', Validators.required],
      'Email': ['', Validators.compose([Validators.required])],
      'Password': ['', Validators.required],
      'Location': ['', Validators.required],
      'AccountType': ['User', Validators.required],
    });

    userService.UserObservable.subscribe(data => {
      if (data && data.uid) {
        console.log('Registration successful');
        this.router.navigate(['/Home']);
      }
    });
  }

  onSubmit(value: any): void {
    if (!this.myForm.valid) {
      console.log('Form Not Valid');
      return;
    }
    console.log('you submitted value: ', value);
    this.userService.firebaseCreateUser(value);
  }

  ngOnInit() {
  }

}
