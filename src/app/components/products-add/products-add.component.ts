import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ProductsService } from '../../services/products.service';
import { UserModel } from '../../models/user.model';
import { ProductModel, Categories } from '../../models/product.model';
import * as firebase from 'firebase';

@Component({
  selector: 'app-products-add',
  templateUrl: './products-add.component.html',
  styleUrls: ['./products-add.component.css']
})
export class ProductsAddComponent implements OnInit {

  myForm: FormGroup;
  user: UserModel;
  categories = Categories;
  ErrorMessage: String;
  progress = 0;
  isFileUploading;
  FileUrl: String;

  constructor(
    fb: FormBuilder,
    private userService: UserService,
    private productsService: ProductsService,
    private router: Router,
  ) {
    this.myForm = fb.group({
      'Title': ['', Validators.required],
      'Description': ['', Validators.required],
      'Category': ['', Validators.required],
      'AuctionEndDate': ['', Validators.required],
      'AuctionEndTime': ['', Validators.required],
      'BidStartingAmount': ['', Validators.required],
    });

    userService.UserObservable.subscribe(data => {
      if (data && data.uid) {
        this.user = data;
      }
    });

  }

  onSubmit(value: ProductModel): void {
    this.ErrorMessage = '';
    if (!this.myForm.valid) {
      this.ErrorMessage = 'Form Not Valid';
      console.log('Form Not Valid');
      return;
    }

    const endTime = new Date(value.AutionEndDate + ' ' + value.AutionEndTime);

    if (endTime < new Date()) {
      this.ErrorMessage = 'Auction end date should not be past date';
      console.log('Auction end date should not be past date');
      return;
    }

    value.uid = this.user.uid;
    value.Location = this.user.Location;
    value.FirstName = this.user.FirstName;
    value.LastName = this.user.LastName;
    value.AutionEndTimeStamp = endTime.getTime();
    value.MinimumBidAmount = value.BidStartingAmount;
    value.Status = 'In-Process';
    if (this.FileUrl) {
      value.File = this.FileUrl;
    }

    console.log('you submitted value: ', value);
    this.productsService.addProduct(value);
    this.router.navigate(['/Home']);
    return;

  }


  fileChanged(event) {
    const self = this;

    const files = event.srcElement.files[0];
    console.log(files);
    if (!files) {
      return;
    }

    self.progress = 0;
    self.isFileUploading = true;

    const filesRef = this.productsService.filesRef;

    const metadata = {
      contentType: files.type,
    };

    const fileName = Date.now() + '-' + files.name;
    const spaceRef = filesRef.child(fileName);

    // File path is 'images/space.jpg'
    const path = spaceRef.fullPath;

    const uploadTask = this.productsService.storageRef.child(path).put(files, metadata);

    // File name is 'space.jpg'
    const name = spaceRef.name;

    uploadTask.on('state_changed', function (snapshot) {
      self.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + self.progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function (error) {
    }, function () {
      const downloadURL = uploadTask.snapshot.downloadURL;
      console.log('downloadURL', downloadURL);

      self.progress = 0;
      self.isFileUploading = false;
      self.FileUrl = downloadURL;
    });
  }

  ngOnInit() {

  }

}
