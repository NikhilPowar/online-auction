/**
 * Created by Ahmer on 05-Apr-18.
 */

import {  Routes } from '@angular/router';

import { AppComponent } from '../app.component';
import { HomeComponent } from '../components/home/home.component';
import { SampleComponent } from '../components/sample/sample.component';
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';
import { RegisterComponent } from '../components/register/register.component';
import { UserService } from '../services/user.service';
import { LoggedInGuardService } from '../services/logged-in-guard.service';
import { AccountsService } from '../services/accounts.service';
import { ProductsService } from '../services/products.service';
import { LoginComponent } from '../components/login/login.component';
import { UsersComponent } from '../components/users/users.component';

import { ProductsComponent } from '../components/products/products.component';
import { ProductsAddComponent } from '../components/products-add/products-add.component';
import { ProductsDetailComponent } from '../components/products-detail/products-detail.component';
import { MyAwardedBidsComponent } from '../components/my-awarded-bids/my-awarded-bids.component';


export const appRoutes: Routes = [
  { path: '', redirectTo: '/Home', pathMatch: 'full', canActivate: [LoggedInGuardService]},
  { path: 'Home', component: HomeComponent, canActivate: [LoggedInGuardService]},
  { path: 'Login', component: LoginComponent},
  { path: 'Register', component: RegisterComponent},
  { path: 'ProductsAdd', component: ProductsAddComponent, data: {access : ['Admin', 'User']}, canActivate: [LoggedInGuardService]},
  { path: 'Products', component: ProductsComponent, data: {access : ['Admin', 'User']}, canActivate: [LoggedInGuardService]},
  { path: 'Products/:id', component: ProductsComponent, data: {access : ['Admin', 'User']}, canActivate: [LoggedInGuardService]},
  // tslint:disable-next-line:max-line-length
  { path: 'ProductsDetail/:id', component: ProductsDetailComponent, data: {access : ['Admin', 'User']}, canActivate: [LoggedInGuardService]},
  { path: 'MyAwardedBids', component: MyAwardedBidsComponent, data: {access : ['Admin', 'User']}, canActivate: [LoggedInGuardService]},
  { path: 'Sample', component: SampleComponent },
  { path: '**', component: PageNotFoundComponent }
];