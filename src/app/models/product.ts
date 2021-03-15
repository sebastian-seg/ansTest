export class Product {
    name: string;
    sellIn: number;
    price: number;
    hasFullCoverage:boolean;
    hasMegaCoverage:boolean;
    hasSpecialFullCoverage:boolean;
    hasSuperSale:boolean;
    description:string;

    constructor(_name, _sellIn, _price) {
        this.name = _name;
        this.sellIn = _sellIn;
        this.price = _price;
      }
}