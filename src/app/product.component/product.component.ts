import { Component, OnInit, Injectable } from '@angular/core';
import { Product } from '../models/product';
// import { NgbModule, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { OnlyDigitHelper } from '../utils/utils';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'product-component',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
  })

@Injectable()
export class ProductComponent implements OnInit {

    constructor(
      private onlyDigitHelper: OnlyDigitHelper,
      private modalService: NgbModal
    ) { }
    
    productsList: Product[] = [];
    currentProduct:Product;
    selectedProductIndex:number = 0;
    priceLimit:number = 50;
    productName:string = '';
    productDescription: string = '';
    mode:string = 'new';

    resultsToDisplay:string = '';

    carInsuranceProjection:Product[][]=[];
    
    productFormGroup = new FormGroup({

      priceControl: new FormControl(0, [Validators.required, Validators.pattern('[0-9]+'), Validators.min(0), Validators.max(50)]),
      sellInControl: new FormControl(0, [Validators.required, Validators.pattern('[0-9]*'), Validators.min(0)]),
      nameControl: new FormControl('', [Validators.required, Validators.maxLength(99)]),
      descriptionControl: new FormControl('', [Validators.required, Validators.maxLength(99)]),
    });

    ngOnInit(){
      this.getPersistedData();
      this.setDefaultData();

      let shouldRunProjectionOnStart = environment.shouldRunProjectionOnStart;
      if(shouldRunProjectionOnStart){
        if(this.productsList !== null && this.productsList.length > 0) this.show30DaysProjectionResults();
        else this.resultsToDisplay = 'You tried to project prices over 30 days, but you had no persisted products to work with.'
      }
    }

    getPersistedData(){
      let productsListAsPlainText = localStorage.getItem("productsList");
      if(productsListAsPlainText !== null && productsListAsPlainText !== ''){
        this.productsList = JSON.parse(productsListAsPlainText);
      }
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

    // Sets the specific product status/property
    // This was the "product name" in the former implementation
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
    
    updateAndShowPrice(){
      let updatedProducts:Product[] = this.updatePrice();
      var str = JSON.stringify(updatedProducts, null, 2); // spacing level = 2
      this.resultsToDisplay = str;
    }

    //Updates the price once, ideally, at the end of the day, according to the test's statement
    updatePrice(): Product[]{
      if(this.productsList !== null && this.productsList.length > 0){
        let carInsurance:Product[] = [];
        this.productsList.forEach(prod => {

          let updatedProduct:Product = {
            description: prod.description,
            hasFullCoverage: prod.hasFullCoverage,
            hasMegaCoverage: prod.hasMegaCoverage,
            hasSpecialFullCoverage: prod.hasSpecialFullCoverage,
            hasSuperSale: prod.hasSuperSale,
            name: prod.name,
            price: prod.price,
            sellIn: prod.sellIn
          }
          let degradationFactor:number = 0;

          if(updatedProduct.hasFullCoverage){
            degradationFactor = -1;
            if(updatedProduct.sellIn <= 0) degradationFactor = -2;
          }
          if(prod.hasMegaCoverage){
            // price never decreases
          }
          if(updatedProduct.hasSpecialFullCoverage){
            degradationFactor = -1;
            if(updatedProduct.sellIn <= 10 && updatedProduct.sellIn > 5) degradationFactor = -2;
            if(updatedProduct.sellIn <= 5 && updatedProduct.sellIn > 0) degradationFactor = -3;
            if(updatedProduct.sellIn === 0) degradationFactor = updatedProduct.price;
          }
          if(updatedProduct.hasSuperSale){
            degradationFactor = 2;
            if(updatedProduct.sellIn <= 0) degradationFactor = 2*degradationFactor;
          }

          let updatedPrice:number = 0;
          updatedPrice = prod.price - degradationFactor;
          if(updatedPrice <= 0) updatedPrice = 0;
          if(updatedPrice >= 50) updatedPrice = 50;

          updatedProduct.price = updatedPrice;
          updatedProduct.sellIn = updatedProduct.sellIn-1;

          carInsurance.push(updatedProduct);
        })

        //this.carInsuranceProjection.push(carInsurance);
        return carInsurance;
      }
      else return null;
    }

    show30DaysProjectionResults(){
      let projection:Product[][] = this.product30DaysProjection();
      var str = JSON.stringify(projection, null, 2); // spacing level = 2
      this.resultsToDisplay = str;
    }

    //Updates/Projects prices for producs throughout 30 days
    product30DaysProjection():Product[][]{

      for (let i = 0; i < 30; i++) {
        let carInsurance:Product[] = [];
        carInsurance = this.updatePrice();
        if(carInsurance !== null && carInsurance.length > 0){
          this.carInsuranceProjection.push(carInsurance);
        }
      }

      return this.carInsuranceProjection;
    }

    
  
}