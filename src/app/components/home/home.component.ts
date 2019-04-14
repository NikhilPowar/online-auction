import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user.model';
import { ProductsService } from '../../services/products.service';
import { Router, ActivatedRoute } from '@angular/router';
import ProductModel from '../../models/product.model';
import { AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: UserModel;
  products: AngularFireList<ProductModel>;
  id: String;
  recentBids: ProductModel[];

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
          this.recentBids = result;
        });
      });
    });
  }

  ngOnInit() {
  }

}
