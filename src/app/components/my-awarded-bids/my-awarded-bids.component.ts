import { Component, OnInit } from '@angular/core';
import { AngularFireList } from 'angularfire2/database';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { UserModel } from '../../models/user.model';
import { ProductModel } from '../../models/product.model';
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

        productsService.productsArr.subscribe(result => {
          this.productsArr = result;
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
    const c = confirm('Are you sure you want to delete this product? This action cannot be undone.');
    if (c) {
      this.productsService.deleteProduct(key);
    }
  }
}
