import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/observable';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProductsService } from '../../services/products.service';
import UserModel, { UserType } from '../../models/user.model';
import ProductModel, { Categories } from '../../models/product.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-awarded-bids',
  templateUrl: './my-awarded-bids.component.html',
  styleUrls: ['./my-awarded-bids.component.css']
})
export class MyAwardedBidsComponent implements OnInit {

  user: UserModel;
  products: AngularFireList<ProductModel>;
  id: String;
  productsArr: ProductModel[];

  constructor(
    private productsService: ProductsService,
    private userService: UserService,
    private store: Store<UserModel>,
    private router: Router,
    private route: ActivatedRoute
  ) {

    route.params.subscribe(params => {
      this.id = params['id'];

      userService.UserObservable.subscribe(data => {
        this.user = data;

        if (!(data && data.uid)) {
          this.router.navigate(['/Login']);
          return;
        }
        productsService.fetchProducts({
          orderByChild: 'AuctionAwardedToUID',
          equalTo: this.user.uid
        });

        this.products = productsService.products;

        this.products.valueChanges().subscribe((obj) => {
          this.productsArr = obj;
        });
      });
    });

  }

  ngOnInit() {
  }

  canDelete(item: ProductModel) {
    if (item.Status === 'Awarded' || item.Status === 'Cancelled') {
      return false;
    } else if (this.user.AccountType === 'Admin') {
      return true;
    } else if (this.user.uid === item.uid) {
      return true;
    } else {
      return false;
    }
  }

  delete(key: string) {
    this.productsService.deleteProduct(key);
  }

}
