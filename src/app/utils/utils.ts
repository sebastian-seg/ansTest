import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class OnlyDigitHelper {

    constructor() {}
    
    isNumeric(event) {
        let key = Number(event.key);
        if (isNaN(key) || event.key === null || event.key === ' ') {
          if (event.key !== 'Backspace' && event.key !== 'Tab') {
            event.preventDefault();
            return;
          }
        }
      }

    dinamicYears(){
      var start_year = 1920;
      var current_year = new Date().getFullYear();
      var range = [];
      let addToNextYear = 0;
      let currentMonth = new Date().getMonth() + 1;
      if ( currentMonth > 6){
        addToNextYear = 1;
      }

      for (var i = start_year; i <= current_year + addToNextYear; i++) {
        range.unshift({ key: i, value: i }); 
      }

      return range;
    }

    removeAccents(value) {
      return value
          .replace(/á/g, 'a')            
          .replace(/é/g, 'e')
          .replace(/í/g, 'i')
          .replace(/ó/g, 'o')
          .replace(/ú/g, 'u');
    }
    
}