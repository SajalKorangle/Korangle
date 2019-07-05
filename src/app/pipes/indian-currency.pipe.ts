import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'indianCurrency'})
export class IndianCurrencyPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}
    transform(money, symbol: boolean = false) {
        money = Math.round(money);
        const result = money.toString().split('.');
        let lastThree = result[0].substring(result[0].length - 3);
        const otherNumbers = result[0].substring(0, result[0].length - 3);
        if (otherNumbers !== '' && otherNumbers !== '-') {
            lastThree = ',' + lastThree;
        }
        let output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

        if (result.length > 1) {
            output += '.' + result[1];
        }

        if (symbol) {
            output = 'Rs.' + ' ' + output;
        }

        return output;
    }
}
