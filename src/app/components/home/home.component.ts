import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user.model';
import { ProductsService } from '../../services/products.service';
import { Router, ActivatedRoute } from '@angular/router';
import ProductModel, { AuctionModel } from '../../models/product.model';
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
  productsArr: any[];
  ongoing: any[];
  ended: any[];
  auctionsArr: AuctionModel[];

  constructor(
    private productsService: ProductsService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    route.params.subscribe(params => {
      userService.UserObservable.subscribe(data => {
        this.user = data;

        if (!(data && data.uid)) {
          this.router.navigate(['/Login']);
          return;
        }
        productsService.fetchProducts({});

        productsService.productsArr.subscribe(result => {
          this.productsArr = result;
        });

        productsService.fetchAuctions({
          orderByChild: 'uid',
          equalTo: this.user.uid
        });

        productsService.auctionsArr.subscribe(result => {
          this.auctionsArr = result;
          this.getInvolvedAuctions();
        });
      });
    });
  }

  ngOnInit() {
  }

  getInvolvedAuctions() {
    this.productsArr.forEach(product => {
      this.checkFn(product);
    });
    this.ongoing = [];
    this.ended = [];
    this.auctionsArr.forEach((auction) => {
      this.productsArr.forEach((product) => {
        if (product.key === auction.pid) {
          const currentDate = new Date();
          const bidEndDate = new Date(<any>product.AutionEndTimeStamp);
          if (bidEndDate >= currentDate) {
            if (!this.ongoing.includes(product)) {
              this.ongoing.push(product);
            }
          } else {
            if (!this.ended.includes(product)) {
              this.ended.push(product);
            }
          }
        }
      });
    });
    console.log(this.ongoing);
  }

  checkFn(product) {
    const currentDate = new Date();
    this.productsService.fetchProductObj(product.key);
    if (product.Status === 'Awarded' || product.Status === 'Cancelled') {
      return;
    }
    const bidEndDate = new Date(<any>product.AutionEndTimeStamp);
    if (bidEndDate <= currentDate) {
      const auctions = this.auctionsArr.filter(auction => auction.pid === product.key);
      if (auctions && auctions.length) {
        const lastObj = auctions[auctions.length - 1];
        const obj = {
          Status: 'Awarded',
          AuctionAwardedToUID: lastObj.uid,
          AuctionAwardedToFirstName: lastObj.FirstName,
          AuctionAwardedToLastName: lastObj.LastName,
          AuctionAwardedToAmount: lastObj.Bid,
        };
        this.productsService.updateProduct(obj);
      } else {
        this.productsService.updateProduct({ Status: 'Cancelled' });
      }
    }
  }
}
