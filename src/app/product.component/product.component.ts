import { Component, OnInit, Injectable } from '@angular/core';
import { Product } from '../models/product';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OnlyDigitHelper } from '../utils/utils';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'product-component',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
  })

@Injectable()
export class ProductComponent implements OnInit {

    constructor(
      private onlyDigitHelper: OnlyDigitHelper
    ) { }
    
    productsList: Product[] = [];
    currentProduct:Product;
    selectedProductIndex:number = 0;
    priceLimit:number = 50;
    productName:string = '';
    productDescription: string = '';
    mode:string = 'new';
    isValidProduct = false;

    
    productFormGroup = new FormGroup({

      priceControl: new FormControl(0, [Validators.required, Validators.pattern('[0-9]+'), Validators.min(0), Validators.max(50)]),
      sellInControl: new FormControl(0, [Validators.required, Validators.pattern('[0-9]*'), Validators.min(0)]),
      nameControl: new FormControl('', [Validators.required, Validators.maxLength(99)]),
      descriptionControl: new FormControl('', [Validators.required, Validators.maxLength(99)]),
    });

    ngOnInit(){
      this.getPersistedData();
      this.setDefaultData();
    }

    getPersistedData(){
      let productsListAsPlainText = localStorage.getItem("productsList");
      if(productsListAsPlainText !== null && productsListAsPlainText !== ''){
        debugger;
        this.productsList = JSON.parse(productsListAsPlainText);
      }
    }

    ngDoCheck(){
      if(this.currentProduct.description !== '' && this.currentProduct.name !== '' && this.currentProduct.price > 0 && this.currentProduct.sellIn > 0){
        this.isValidProduct = true;
      }
      else
        this.isValidProduct = false;


    }

    setDefaultData(){
      this.currentProduct = new Product(this.productName, 0, 0);
      this.currentProduct.description = this.productDescription;
      this.currentProduct.hasFullCoverage = false;
      this.currentProduct.hasMegaCoverage = false;
      this.currentProduct.hasSpecialFullCoverage = false;
      this.currentProduct.hasSuperSale = false;
      this.mode = 'new';
    }

    clearProduct(){
      this.setDefaultData();
      this.setFormData();
    }

    loadProduct(prod: Product, index: number){

      this.selectedProductIndex = index;
      this.currentProduct = prod;
      this.mode = 'update';

      this.setFormData();
    }

    setFormData(){
      this.productFormGroup.controls.priceControl.setValue(this.currentProduct.price);
      this.productFormGroup.controls.sellInControl.setValue(this.currentProduct.sellIn);
      this.productFormGroup.controls.nameControl.setValue(this.currentProduct.name);
      this.productFormGroup.controls.descriptionControl.setValue(this.currentProduct.description);
    }

    addNewProduct(){
      
      this.currentProduct.name = this.productFormGroup.controls.nameControl.value;
      this.currentProduct.description = this.productFormGroup.controls.descriptionControl.value;
      this.currentProduct.price = this.productFormGroup.controls.priceControl.value;
      this.currentProduct.sellIn = this.productFormGroup.controls.sellInControl.value;

      let newProduct:Product = {
        description: this.currentProduct.description,
        name: this.currentProduct.name,
        hasFullCoverage: this.currentProduct.hasFullCoverage,
        hasMegaCoverage: this.currentProduct.hasMegaCoverage,
        hasSpecialFullCoverage: this.currentProduct.hasSpecialFullCoverage,
        hasSuperSale: this.currentProduct.hasSuperSale,
        sellIn: this.currentProduct.sellIn,
        price: this.currentProduct.price
      }
      this.productsList.push(newProduct);

      this.currentProduct = new Product('', 0, 0);
      this.setFormData();
    }

    updateProduct(){
      
      this.currentProduct.name = this.productFormGroup.controls.nameControl.value;
      this.currentProduct.description = this.productFormGroup.controls.descriptionControl.value;
      this.currentProduct.price = this.productFormGroup.controls.priceControl.value;
      this.currentProduct.sellIn = this.productFormGroup.controls.sellInControl.value;
      
      let updatedProduct:Product = {
        description: this.currentProduct.description,
        name: this.currentProduct.name,
        hasFullCoverage: this.currentProduct.hasFullCoverage,
        hasMegaCoverage: this.currentProduct.hasMegaCoverage,
        hasSpecialFullCoverage: this.currentProduct.hasSpecialFullCoverage,
        hasSuperSale: this.currentProduct.hasSuperSale,
        sellIn: this.currentProduct.sellIn,
        price: this.currentProduct.price
      }
      this.productsList[this.selectedProductIndex] = updatedProduct;
    }

    newCarInsurance(){

    }

    setSpecialStatus(specialProperty: string){

      switch (specialProperty) {
        case 'fc':
          this.currentProduct.hasFullCoverage = !this.currentProduct.hasFullCoverage;
          this.currentProduct.hasMegaCoverage = false;
          this.currentProduct.hasSpecialFullCoverage = false;
          this.currentProduct.hasSuperSale = false;
          break;
        case 'mc':
          this.currentProduct.hasFullCoverage = false;
          this.currentProduct.hasMegaCoverage = true;
          this.currentProduct.hasSpecialFullCoverage = false;
          this.currentProduct.hasSuperSale = false;
          break;
        case 'sfc':
          this.currentProduct.hasFullCoverage = false;
          this.currentProduct.hasMegaCoverage = false;
          this.currentProduct.hasSpecialFullCoverage = true;
          this.currentProduct.hasSuperSale = false;
          break;
        case 'ss':
          this.currentProduct.hasFullCoverage = false;
          this.currentProduct.hasMegaCoverage = false;
          this.currentProduct.hasSpecialFullCoverage = false;
          this.currentProduct.hasSuperSale = true;
          break;
        
        default:
          return;
      }

    }

    persistList(){
      let productsListAsPlainText = JSON.stringify(this.productsList);
      localStorage.setItem("productsList", productsListAsPlainText);
    }

    clearPersistedList(){
      localStorage.setItem("productsList", '');
    }

    clearCurrentProdcutsList(){
      this.productsList = [];
    }

    isNumeric(event) {
      this.onlyDigitHelper.isNumeric(event);
    }
    
    
}