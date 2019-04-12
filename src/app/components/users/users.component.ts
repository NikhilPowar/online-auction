import { Component, OnInit } from '@angular/core';
import { AngularFireList } from 'angularfire2/database';
import { AccountsService } from '../../services/accounts.service';
import { UserService } from '../../services/user.service';
import { UserModel, UserType } from '../../models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  accounts: AngularFireList<any[]>;
  accountsArr: any[];
  user: UserModel;

  constructor (
    private accountService: AccountsService,
    private userService: UserService
  ) {

    accountService.fetchAccounts(UserType.User);
    accountService.accountsArr.subscribe(result => {
      this.accountsArr = result;
    });

    userService.UserObservable.subscribe(data => {
      this.user = data;
    });

  }

  ngOnInit() {
  }

  delete(key: string) {
    const c = confirm('Are you sure you want to delete this user? This action is irreversible.');
    if (c) {
      this.accountService.deleteAccount(key);
    }
  }
}
