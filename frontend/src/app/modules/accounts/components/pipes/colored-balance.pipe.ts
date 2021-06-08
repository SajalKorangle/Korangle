import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { NEGATIVE_BALANCE_COLOR, POSITIVE_BALANCE_COLOR} from './../../classes/constants';

@Pipe({ name: 'coloredBalance' })
export class ColoredBalancePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}
    transform(balance: number): string {
        if (balance >= 0) {
            return POSITIVE_BALANCE_COLOR;
        }
        else {
            return NEGATIVE_BALANCE_COLOR;
        }
    }
}
