import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/observable';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import UserModel, { UserType } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { AccountsService } from '../../services/accounts.service';
import { ProductsService } from '../../services/products.service';
import ProductModel, { AuctionModel } from '../../models/product.model';


@Component({
  selector: 'app-products-detail',
  templateUrl: './products-detail.component.html',
  styleUrls: ['./products-detail.component.css']
})
export class ProductsDetailComponent implements OnInit {

  user: UserModel;
  product: AngularFireObject<ProductModel>;
  productDetail: ProductModel;
  auctions: AngularFireList<AuctionModel>;
  auctionsDetail: AuctionModel[];
  id: String;
  auctionNotCompleted = false;
  bidAmount: number = null;
  ErrorMessage = '';

  constructor(
    private productsService: ProductsService,
    private userService: UserService,
    private accountsService: AccountsService,
    private store: Store<UserModel>,
    private router: Router,
    private route: ActivatedRoute
  ) {

    route.params.subscribe(params => {
      this.id = params['id'];

      userService.UserObservable.subscribe(data => {
        this.user = data;
        if (this.user && this.user.uid) {
          productsService.fetchProductObj(this.id);
          this.product = productsService.product;
          this.auctions = productsService.auctions;
        }
      });

      this.product.valueChanges().subscribe((data: ProductModel) => {
        this.productDetail = data;

        this.auctions.valueChanges().subscribe((obj: AuctionModel[]) => {
          this.auctionsDetail = obj;
          this.checkFn();
        });
      });
    });
  }

  checkFn() {
    const currentDate = new Date();
    if (this.productDetail.Status === 'Awarded' || this.productDetail.Status === 'Cancelled') {
      return;
    }

    const bidEndDate = new Date(<any>this.productDetail.AutionEndTimeStamp);
    if (bidEndDate <= currentDate) {

      if (this.auctionsDetail && this.auctionsDetail.length) {
        const lastObj = this.auctionsDetail[this.auctionsDetail.length - 1];

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
    } else {
      this.auctionNotCompleted = true;
    }

  }

  displayableDate(dt) {
    const date = new Date(dt);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
  }

  submitBid() {
    if (!this.bidAmount) {
      this.ErrorMessage = 'Please Enter Bid Amount';
      return;
    }
    this.bidAmount = Number(this.bidAmount);
    if (isNaN(this.bidAmount)) {
      this.ErrorMessage = 'Please Enter Bid Amount in Number';
      return;
    }

    let lastBid = this.productDetail.BidStartingAmount;
    if (this.auctionsDetail && this.auctionsDetail.length) {
      lastBid = this.auctionsDetail[this.auctionsDetail.length - 1].Bid;
    }

    if (this.bidAmount <= lastBid) {
      this.ErrorMessage = 'Bid amount should be greater then ' + lastBid;
      return;
    }

    const currentDate = new Date();
    const bidEndDate = new Date(<any>this.productDetail.AutionEndTimeStamp);
    if (bidEndDate <= currentDate) {
      this.ErrorMessage = 'Bid Closed';
      this.checkFn();
      return;
    }

    const obj: AuctionModel = {
      uid: this.user.uid,
      pid: this.id,
      FirstName: this.user.FirstName,
      LastName: this.user.LastName,
      Bid: this.bidAmount,
      TimeStamp: Date.now(),
      DateTime: (new Date()).toString()
    };
    this.productsService.addAuction(obj);
    this.bidAmount = null;
    this.ErrorMessage = '';
  }

  ngOnInit() {
  }

}
