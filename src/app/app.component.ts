import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { AccountsService } from './services/accounts.service';
import { UserService } from './services/user.service';
import UserModel, { UserType } from './models/user.model';
import { Categories } from './models/product.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  user: UserModel;
  userType = UserType;
  categories = Categories;

  constructor(
    private userService: UserService,
    private store: Store<UserModel>,
    private router: Router
  ) {
    userService.firebaseIsLogin();

    userService.UserObservable.subscribe(data => {
      this.user = data;
    });
  }

  logout() {
    this.userService.firebaseLogout();
    this.router.navigate(['/Login']);
  }

  canShow(user: UserModel, role: String[]) {
    if (role.indexOf(user.AccountType) !== -1) {
      return true;
    } else {
      return false;
    }
  }
}