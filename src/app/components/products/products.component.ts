import { Component, OnInit } from '@angular/core';
import { AngularFireList} from 'angularfire2/database';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { UserModel } from '../../models/user.model';
import { ProductModel, Categories, AuctionModel } from '../../models/product.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  user: UserModel;
  products: AngularFireList<ProductModel>;
  id: String;
  productsArr: ProductModel[];
  auctionsArr: AuctionModel[];
  category: string;

  constructor(
    private productsService: ProductsService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    route.params.subscribe(params => {
      this.category = null;
      this.id = params['id'];

      userService.UserObservable.subscribe(data => {
        this.user = data;

        if (!(data && data.uid)) {
          this.router.navigate(['/Login']);
          return;
        }

        if (this.id && Categories.indexOf(<any>this.id) !== -1) {
          this.category = this.id.valueOf();
          console.log('Fetching products by category...');
          productsService.fetchProducts({
            orderByChild: 'Category',
            equalTo: this.id
          });
        } else if (this.id) {
          console.log('Fetching products by user...');
          productsService.fetchProducts({
            orderByChild: 'uid',
            equalTo: this.id
          });
        } else {
          productsService.fetchProducts({});
        }

        productsService.fetchAuctions({});

        productsService.productsArr.subscribe(result => {
          this.productsArr = result;
        });

        productsService.auctionsArr.subscribe(result => {
          this.auctionsArr = result;
          this.productsArr.forEach(ele => {
            this.checkFn(ele);
          });
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

  delete(uuid: string) {
    const c = confirm('Are you sure you want to delete this product? This action cannot be undone!');
    if (c) {
      this.productsService.deleteProduct(uuid);
    }
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
