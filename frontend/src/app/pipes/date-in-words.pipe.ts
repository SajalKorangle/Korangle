import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'dateInWords' })
export class DateInWordsPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    transform(inputDate: any) {
        const date = new Date(inputDate);

        let dateInWords = '';

        dateInWords += this.getDate(date) + ' ';
        dateInWords += this.getMonth(date) + ' ';
        dateInWords += this.getYear(date);

        return dateInWords;
    }

    getDate(date: Date): string {
        switch (date.getDate()) {
            case 1:
                return 'First';
            case 2:
                return 'Second';
            case 3:
                return 'Third';
            case 4:
                return 'Fourth';
            case 5:
                return 'Fifth';
            case 6:
                return 'Sixth';
            case 7:
                return 'Seventh';
            case 8:
                return 'Eighth';
            case 9:
                return 'Ninth';
            case 10:
                return 'Tenth';
            case 11:
                return 'Eleven';
            case 12:
                return 'Twelve';
            case 13:
                return 'Thirteen';
            case 14:
                return 'Fourteen';
            case 15:
                return 'Fifteen';
            case 16:
                return 'Sixteen';
            case 17:
                return 'Seventeen';
            case 18:
                return 'Eighteen';
            case 19:
                return 'Nineteen';
            case 20:
                return 'Twenty';
            case 21:
                return 'Twenty First';
            case 22:
                return 'Twenty Second';
            case 23:
                return 'Twenty Third';
            case 24:
                return 'Twenty Fourth';
            case 25:
                return 'Twenty Fifth';
            case 26:
                return 'Twenty Sixth';
            case 27:
                return 'Twenty Seventh';
            case 28:
                return 'Twenty Eighth';
            case 29:
                return 'Twenty Ninth';
            case 30:
                return 'Thirtieth';
            case 31:
                return 'Thirty First';
        }
        return '';
    }

    getMonth(date: Date): string {
        switch (date.getMonth()) {
            case 0:
                return 'January';
            case 1:
                return 'February';
            case 2:
                return 'March';
            case 3:
                return 'April';
            case 4:
                return 'May';
            case 5:
                return 'June';
            case 6:
                return 'July';
            case 7:
                return 'August';
            case 8:
                return 'September';
            case 9:
                return 'October';
            case 10:
                return 'November';
            case 11:
                return 'December';
        }
        return '';
    }

    getYear(date: Date): string {
        if (date.getFullYear() < 2000) {
            return this.getNumberInWords(Math.floor(date.getFullYear() / 100)) + ' ' + this.getNumberInWords(date.getFullYear() % 100);
        } else {
            return 'Two Thousand ' + this.getNumberInWords(date.getFullYear() % 100);
        }
    }

    getNumberInWords(numerical: number): string {
        switch (numerical) {
            case 1:
                return 'One';
            case 2:
                return 'Two';
            case 3:
                return 'Three';
            case 4:
                return 'Four';
            case 5:
                return 'Five';
            case 6:
                return 'Six';
            case 7:
                return 'Seven';
            case 8:
                return 'Eight';
            case 9:
                return 'Nine';
            case 10:
                return 'Ten';
            case 11:
                return 'Eleven';
            case 12:
                return 'Twelve';
            case 13:
                return 'Thirteen';
            case 14:
                return 'Fourteen';
            case 15:
                return 'Fifteen';
            case 16:
                return 'Sixteen';
            case 17:
                return 'Seventeen';
            case 18:
                return 'Eighteen';
            case 19:
                return 'Nineteen';
            case 20:
                return 'Twenty';
            case 21:
                return 'Twenty One';
            case 22:
                return 'Twenty Two';
            case 23:
                return 'Twenty Three';
            case 24:
                return 'Twenty Four';
            case 25:
                return 'Twenty Five';
            case 26:
                return 'Twenty Six';
            case 27:
                return 'Twenty Seven';
            case 28:
                return 'Twenty Eight';
            case 29:
                return 'Twenty Nine';
            case 30:
                return 'Thirty';
            case 31:
                return 'Thirty One';
            case 32:
                return 'Thirty Two';
            case 33:
                return 'Thirty Three';
            case 34:
                return 'Thirty Four';
            case 35:
                return 'Thirty Five';
            case 36:
                return 'Thirty Six';
            case 37:
                return 'Thirty Seven';
            case 38:
                return 'Thirty Eight';
            case 39:
                return 'Thirty Nine';
            case 40:
                return 'Forty';
            case 41:
                return 'Forty One';
            case 42:
                return 'Forty Two';
            case 43:
                return 'Forty Three';
            case 44:
                return 'Forty Four';
            case 45:
                return 'Forty Five';
            case 46:
                return 'Forty Six';
            case 47:
                return 'Forty Seven';
            case 48:
                return 'Forty Eight';
            case 49:
                return 'Forty Nine';
            case 50:
                return 'Fifty';
            case 51:
                return 'Fifty One';
            case 52:
                return 'Fifty Two';
            case 53:
                return 'Fifty Three';
            case 54:
                return 'Fifty Four';
            case 55:
                return 'Fifty Five';
            case 56:
                return 'Fifty Six';
            case 57:
                return 'Fifty Seven';
            case 58:
                return 'Fifty Eight';
            case 59:
                return 'Fifty Nine';
            case 60:
                return 'Sixty';
            case 61:
                return 'Sixty One';
            case 62:
                return 'Sixty Two';
            case 63:
                return 'Sixty Three';
            case 64:
                return 'Sixty Four';
            case 65:
                return 'Sixty Five';
            case 66:
                return 'Sixty Six';
            case 67:
                return 'Sixty Seven';
            case 68:
                return 'Sixty Eight';
            case 69:
                return 'Sixty Nine';
            case 70:
                return 'Seventy';
            case 71:
                return 'Seventy One';
            case 72:
                return 'Seventy Two';
            case 73:
                return 'Seventy Three';
            case 74:
                return 'Seventy Four';
            case 75:
                return 'Seventy Five';
            case 76:
                return 'Seventy Six';
            case 77:
                return 'Seventy Seven';
            case 78:
                return 'Seventy Eight';
            case 79:
                return 'Seventy Nine';
            case 80:
                return 'Eighty';
            case 81:
                return 'Eighty One';
            case 82:
                return 'Eighty Two';
            case 83:
                return 'Eighty Three';
            case 84:
                return 'Eighty Four';
            case 85:
                return 'Eighty Five';
            case 86:
                return 'Eighty Six';
            case 87:
                return 'Eighty Seven';
            case 88:
                return 'Eighty Eight';
            case 89:
                return 'Eighty Nine';
            case 90:
                return 'Ninety';
            case 91:
                return 'Ninety One';
            case 92:
                return 'Ninety Two';
            case 93:
                return 'Ninety Three';
            case 94:
                return 'Ninety Four';
            case 95:
                return 'Ninety Five';
            case 96:
                return 'Ninety Six';
            case 97:
                return 'Ninety Seven';
            case 98:
                return 'Ninety Eight';
            case 99:
                return 'Ninety Nine';
            default:
                return '';
        }
    }
}
