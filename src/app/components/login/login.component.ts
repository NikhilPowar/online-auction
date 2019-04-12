import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  myForm: FormGroup;

  constructor(
    fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.myForm = fb.group({
      'Email': ['', Validators.compose([Validators.required])],
      'Password': ['', Validators.required]
    });

    userService.UserObservable.subscribe(data => {
        if (data && data.uid) {
          console.log('Logged in');
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
    this.userService.firebaseLogin(value);
  }

  ngOnInit() {
  }
}
