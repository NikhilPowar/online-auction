import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';
import { ProductModel, AuctionModel } from '../models/product.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProductsService {

  storage;
  storageRef;
  filesRef;

  products: AngularFireList<ProductModel>;
  productSubject: Subject<any>;
  product: AngularFireObject<ProductModel>;
  auctions: AngularFireList<AuctionModel>;

  productsArr: Observable<any[]>;
  auctionsArr: any[];

  constructor(public af: AngularFireDatabase) {
    this.productSubject = new Subject<any>();

    this.storage = firebase.storage();
    this.storageRef = this.storage.ref();
    this.filesRef = this.storageRef.child('files');

    this.products = this.af.list('/products', ref => ref.orderByChild('Category'));
    this.productsArr = this.products.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }


  fetchProducts(obj) {
    if (Object.keys(obj).length) {
      this.products = this.af.list('/products', ref => ref.orderByChild(obj.orderByChild).equalTo(obj.equalTo));
    } else {
      this.products = this.af.list('/products', ref => ref.orderByChild('Category'));
    }
    this.productsArr = this.products.snapshotChanges().map(actions => {
      return actions.map(a => ({ key: a.payload.key, ...a.payload.val() }));
    });
  }

  fetchProductObj(id) {
    this.product = this.af.object('/products/' + id);
    this.auctions = this.af.list('/auctions', ref => ref.orderByChild('pid').equalTo(id));
  }

  addProduct(obj: ProductModel) {
    this.products = this.af.list('/products');
    this.products.push(obj);
  }

  deleteProduct(key: string) {
    this.af.list('/products').remove(key);
    this.products = this.af.list('/products');
  }

  updateProduct(obj) {
    this.product.update(obj);
  }

  addAuction(obj: AuctionModel) {
    this.auctions = this.af.list('/auctions');
    this.auctions.push(obj);
  }
}
