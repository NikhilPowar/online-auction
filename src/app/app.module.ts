import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatCheckboxModule, MatCardModule, MatChipsModule, MatRadioModule, MatInputModule, MatListModule, MatProgressSpinnerModule, MatProgressBarModule, MatTabsModule, MatIconModule, MatMenuModule, MatSidenavModule, MatGridListModule, MatFormFieldModule, MatSelectModule, MatToolbarModule } from '@angular/material';
import 'hammerjs';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { StoreModule } from '@ngrx/store';

import { appReducer } from './app.store';
import { firebaseConfig } from './app.config';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SampleComponent } from './components/sample/sample.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { UserService } from './services/user.service';
import { appRoutes } from './routerConfig/appRoutes';
import { LoggedInGuardService } from './services/logged-in-guard.service';
import { AccountsService } from './services/accounts.service';
import { ProductsService } from './services/products.service';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';

import { ProductsComponent } from './components/products/products.component';
import { ProductsAddComponent } from './components/products-add/products-add.component';
import { ProductsDetailComponent } from './components/products-detail/products-detail.component';
import { MyAwardedBidsComponent } from './components/my-awarded-bids/my-awarded-bids.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SampleComponent,
    PageNotFoundComponent,
    RegisterComponent,
    LoginComponent,
    UsersComponent,
    ProductsComponent,
    ProductsAddComponent,
    ProductsDetailComponent,
    MyAwardedBidsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatRadioModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatGridListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    StoreModule.forRoot({appStore: appReducer})
  ],
  exports: [
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatRadioModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatGridListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule
  ],
  providers: [
    UserService,
    AccountsService,
    LoggedInGuardService,
    ProductsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
