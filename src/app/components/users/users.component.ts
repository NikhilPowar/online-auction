import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Store } from '@ngrx/store';
import { AccountsService } from '../../services/accounts.service';
import { UserService } from '../../services/user.service';
import UserModel, { UserType } from '../../models/user.model';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  accounts: AngularFireList<any[]>;
  user: UserModel;

  constructor(private accountService: AccountsService, private store: Store<UserModel>, private userService: UserService) {

    accountService.fetchAccounts(UserType.User);
    this.accounts = accountService.accounts;

    userService.UserObservable.subscribe(data => {
      this.user = data;
    });

  }

  ngOnInit() {
  }

  delete(key: string) {
    this.accountService.deleteAccount(key);
  }
}
