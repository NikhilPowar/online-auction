import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';
import { UserModel } from '../models/user.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AccountsService {

  account: AngularFireList<UserModel>;
  accounts: AngularFireList<UserModel[]>;
  accountsArr: Observable<any[]>;
  accountTypeSubject: Subject<String>;

  constructor(public af: AngularFireDatabase) {
    this.accountTypeSubject = new Subject();

    this.accounts = this.af.list('/accounts');
    this.accountsArr = this.accounts.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

  fetchAccounts(accountType) {
    this.accounts = this.af.list('/accounts', ref => ref.orderByChild('AccountType').equalTo(accountType));
    this.accountsArr = this.accounts.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

  fetchAccount(id) {
    this.account = this.af.list('/accounts/' + id);
  }

  deleteAccount(key: string) {
    this.accounts.remove(key);
  }

}
