import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'amountInWords'})
export class AmountInWordsPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    transform(amount: any) {
        let amountInWords = '';
        let tempAmount = amount;

        if (amount == 0) {
            return 'Zero';
        }

        /* Lacs */
        amountInWords += ( Math.floor(tempAmount / 100000) > 0 ? this.getNumberInWords(Math.floor(tempAmount / 100000)) + ' Lacs ' : '' );
        tempAmount = tempAmount % 100000;

        /* Thousand */
        amountInWords += ( Math.floor(tempAmount / 1000) > 0 ? this.getNumberInWords(Math.floor(tempAmount / 1000)) + ' Thousand ' : '' );
        tempAmount = tempAmount % 1000;

        /* Hundred */
        amountInWords += ( Math.floor(tempAmount / 100) > 0 ? this.getNumberInWords(Math.floor(tempAmount / 100)) + ' Hundred ' : '' );
        tempAmount = tempAmount % 100;

        /* Ones And Tens */
        amountInWords += this.getNumberInWords(tempAmount);

        /* Point till decimal one*/
        if (tempAmount%1 > 0) {
            amountInWords += ' Point ' + this.getNumberInWords(((tempAmount*10)%10));
        }

        return amountInWords;
    }

    getNumberInWords(numerical: number): string {
        numerical = numerical - (numerical%1);
        switch (numerical) {
            case 1: return 'One';
            case 2: return 'Two';
            case 3: return 'Three';
            case 4: return 'Four';
            case 5: return 'Five';
            case 6: return 'Six';
            case 7: return 'Seven';
            case 8: return 'Eight';
            case 9: return 'Nine';
            case 10: return 'Ten';
            case 11: return 'Eleven';
            case 12: return 'Twelve';
            case 13: return 'Thirteen';
            case 14: return 'Fourteen';
            case 15: return 'Fifteen';
            case 16: return 'Sixteen';
            case 17: return 'Seventeen';
            case 18: return 'Eighteen';
            case 19: return 'Ninteen';
            case 20: return 'Twenty';
            case 21: return 'Twenty One';
            case 22: return 'Twenty Two';
            case 23: return 'Twenty Three';
            case 24: return 'Twenty Four';
            case 25: return 'Twenty Five';
            case 26: return 'Twenty Six';
            case 27: return 'Twenty Seven';
            case 28: return 'Twenty Eight';
            case 29: return 'Twenty Nine';
            case 30: return 'Thirty';
            case 31: return 'Thirty One';
            case 32: return 'Thirty Two';
            case 33: return 'Thirty Three';
            case 34: return 'Thirty Four';
            case 35: return 'Thirty Five';
            case 36: return 'Thirty Six';
            case 37: return 'Thirty Seven';
            case 38: return 'Thirty Eight';
            case 39: return 'Thirty Nine';
            case 40: return 'Forty';
            case 41: return 'Forty One';
            case 42: return 'Forty Two';
            case 43: return 'Forty Three';
            case 44: return 'Forty Four';
            case 45: return 'Forty Five';
            case 46: return 'Forty Six';
            case 47: return 'Forty Seven';
            case 48: return 'Forty Eight';
            case 49: return 'Forty Nine';
            case 50: return 'Fifty';
            case 51: return 'Fifty One';
            case 52: return 'Fifty Two';
            case 53: return 'Fifty Three';
            case 54: return 'Fifty Four';
            case 55: return 'Fifty Five';
            case 56: return 'Fifty Six';
            case 57: return 'Fifty Seven';
            case 58: return 'Fifty Eight';
            case 59: return 'Fifty Nine';
            case 60: return 'Sixty';
            case 61: return 'Sixty One';
            case 62: return 'Sixty Two';
            case 63: return 'Sixty Three';
            case 64: return 'Sixty Four';
            case 65: return 'Sixty Five';
            case 66: return 'Sixty Six';
            case 67: return 'Sixty Seven';
            case 68: return 'Sixty Eight';
            case 69: return 'Sixty Nine';
            case 70: return 'Seventy';
            case 71: return 'Seventy One';
            case 72: return 'Seventy Two';
            case 73: return 'Seventy Three';
            case 74: return 'Seventy Four';
            case 75: return 'Seventy Five';
            case 76: return 'Seventy Six';
            case 77: return 'Seventy Seven';
            case 78: return 'Seventy Eight';
            case 79: return 'Seventy Nine';
            case 80: return 'Eighty';
            case 81: return 'Eighty One';
            case 82: return 'Eighty Two';
            case 83: return 'Eighty Three';
            case 84: return 'Eighty Four';
            case 85: return 'Eighty Five';
            case 86: return 'Eighty Six';
            case 87: return 'Eighty Seven';
            case 88: return 'Eighty Eight';
            case 89: return 'Eighty Nine';
            case 90: return 'Ninty';
            case 91: return 'Ninty One';
            case 92: return 'Ninty Two';
            case 93: return 'Ninty Three';
            case 94: return 'Ninty Four';
            case 95: return 'Ninty Five';
            case 96: return 'Ninty Six';
            case 97: return 'Ninty Seven';
            case 98: return 'Ninty Eight';
            case 99: return 'Ninty Nine';
            default: return '';
        }
    }

}
