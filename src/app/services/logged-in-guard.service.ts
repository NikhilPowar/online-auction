import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';
import { UserModel } from '../models/user.model';

import { appRoutes } from '../routerConfig/appRoutes';

@Injectable()
export class LoggedInGuardService implements CanActivate {

  user: UserModel;
  urls: any = {};

  constructor(
    private userService: UserService
    ) {

    userService.UserObservable.subscribe(data => {
      this.user = data;
    });

    for (let x = 0; x < appRoutes.length; x++) {
      this.urls[appRoutes[x].path] = appRoutes[x].data && appRoutes[x].data['access'];
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    url = url.substr(1);

    if (this.user && this.user.uid) {
      if (this.urls[url] && this.urls[url].length && this.urls[url].indexOf(this.user.AccountType) !== -1 ) {
        return true;
      } else if (this.urls[url] && this.urls[url].length) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}
