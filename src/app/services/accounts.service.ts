import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';
import UserModel from '../models/user.model';

@Injectable()
export class AccountsService {

  account: AngularFireList<UserModel>;
  accounts: AngularFireList<UserModel[]>;
  accountTypeSubject: Subject<String>;

  constructor(public af: AngularFireDatabase) {
    this.accountTypeSubject = new Subject();

    this.accounts = this.af.list('/accounts');  // .orderByChild('AccountType') //.equalTo(this.accountTypeSubject)
  }

  fetchAccounts(accountType) {
    const self = this;

    setTimeout(function() {
      self.accountTypeSubject.next(accountType);
    }, 100);
  }

  fetchAccount(id) {
    this.account = this.af.list('/accounts/' + id);
  }

  deleteAccount(key: string) {
    this.accounts.remove(key);
  }

}
