import { Component, OnInit } from '@angular/core';
import { AngularFireList, AngularFireObject } from 'angularfire2/database';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ProductsService } from '../../services/products.service';
import { ProductModel, AuctionModel } from '../../models/product.model';

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
  highestBid: AuctionModel;
  userBid: AuctionModel;
  id: String;
  auctionNotCompleted = false;
  bidAmount: number = null;
  ErrorMessage = '';

  constructor(
    private productsService: ProductsService,
    private userService: UserService,
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

      this.highestBid = {
        uid: null,
        pid: null,
        FirstName: null,
        LastName: null,
        Bid: 0,
        TimeStamp: null,
        DateTime: null
      };

      this.userBid = {
        uid: null,
        pid: null,
        FirstName: null,
        LastName: null,
        Bid: 0,
        TimeStamp: null,
        DateTime: null
      };

      this.product.valueChanges().subscribe((data: ProductModel) => {
        this.productDetail = data;
        console.log(this.productDetail);
        this.auctions.valueChanges().subscribe((obj: AuctionModel[]) => {
          this.auctionsDetail = obj;
          this.checkFn();
          this.getHighestBid();
          this.getUserBid();
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

  getHighestBid() {
    if (this.auctionsDetail && this.auctionsDetail.length) {
      this.highestBid = this.auctionsDetail[this.auctionsDetail.length - 1];
    }
  }

  getUserBid() {
    if (this.auctionsDetail && this.auctionsDetail.length) {
      for (const bid of this.auctionsDetail) {
        if (bid.uid === this.user.uid) {
          this.userBid = bid;
        }
      }
    }
  }

  raiseBid(amount: number) {
    amount = this.highestBid.Bid.valueOf() + amount;

    const currentDate = new Date();
    const bidEndDate = new Date(<any>this.productDetail.AutionEndTimeStamp);
    if (bidEndDate <= currentDate) {
      this.ErrorMessage = 'Bids closed';
      this.checkFn();
      return;
    }

    // tslint:disable-next-line:max-line-length
    const c = confirm('Are you sure you want to bid ' + amount.toString() + ' on this product? This action will be final.');
    if (!c) {
      return;
    }

    // check again to verify no other higher bid has been made during time taken for confirmation
    amount = Number(amount);
    if (amount <= this.highestBid.Bid) {
      this.ErrorMessage = 'Someone else bid a greater amount. Please try again.';
      return;
    }

    const obj: AuctionModel = {
      uid: this.user.uid,
      pid: this.id,
      FirstName: this.user.FirstName,
      LastName: this.user.LastName,
      Bid: amount,
      TimeStamp: Date.now(),
      DateTime: (new Date()).toString()
    };
    this.productsService.addAuction(obj);
    this.bidAmount = null;
    this.ErrorMessage = '';
  }

  submitBid() {
    if (this.highestBid.uid === this.user.uid) {
      this.ErrorMessage = 'Highest bid is already yours';
      return;
    }

    if (!this.bidAmount) {
      this.ErrorMessage = 'Please enter bid amount';
      return;
    }
    this.bidAmount = Number(this.bidAmount);
    if (isNaN(this.bidAmount)) {
      this.ErrorMessage = 'Please enter bid amount as number';
      return;
    }

    if (this.bidAmount <= this.highestBid.Bid) {
      this.ErrorMessage = 'Bid amount must be greater than ' + this.highestBid;
      return;
    }

    const currentDate = new Date();
    const bidEndDate = new Date(<any>this.productDetail.AutionEndTimeStamp);
    if (bidEndDate <= currentDate) {
      this.ErrorMessage = 'Auction closed';
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
