import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { UserModel } from '../models/user.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

  public UserObservable: ReplaySubject<UserModel> = new ReplaySubject(1);
  public UserFirebaseObservable: AngularFireObject<UserModel>;
  public user: Observable<any>;

  constructor(
    public af: AngularFireDatabase,
    public afAuth: AngularFireAuth
  ) { }

  firebaseIsLogin() {
    const _self = this;
    firebase.auth().onAuthStateChanged(data => {

      if (data && data.uid) {
        _self.UserFirebaseObservable = _self.af.object('/accounts/' + data.uid);

        _self.UserFirebaseObservable.valueChanges().subscribe(obj => {
          _self.UserObservable.next(obj);
        });
      } else {
        _self.UserObservable.next(null);
      }
    });
  }

  firebaseLogout() {
    const _self = this;
    firebase.auth().signOut();
    _self.UserObservable.next(null);
  }

  firebaseCreateUser(userObj) {
    const _self = this;

    firebase.auth().createUserWithEmailAndPassword(
      userObj.Email,
      userObj.Password
    ).then(function(data) {

      userObj.uid = data.uid;

      _self.UserFirebaseObservable = _self.af.object('/accounts/' + data.uid);
      _self.UserFirebaseObservable.set(userObj);
      _self.UserObservable.next(userObj);
      console.log('User created');
    }).catch(function(err) {
      console.log('err', err);
    });
  }


  firebaseLogin(userObj): Promise<any> {
    const _self = this;

    return firebase.auth().signInWithEmailAndPassword(
      userObj.Email,
      userObj.Password
    ).then(function(data) {
      userObj.uid = data.uid;

      _self.UserFirebaseObservable = _self.af.object('/accounts/' + data.uid);
      return _self.UserFirebaseObservable.valueChanges().subscribe(obj => {
        if (userObj.Email === 'admin@gmail.com' && !obj) {
            obj = {
              uid : userObj.uid,
              Email : userObj.Email,
              AccountType : 'Admin',
              FirstName : 'Admin',
              LastName : 'Admin',
              Location : 'Unknown'
            };
            _self.UserFirebaseObservable.set(obj);
        }
        _self.UserObservable.next(obj);
        console.log('User logged in');
      });
    }).catch(function(err) {
      console.log('err', err);
      return err;
    });
  }

  getUser(uid) {
    this.user = this.af.object('/accounts/' + uid).valueChanges();
  }
}
