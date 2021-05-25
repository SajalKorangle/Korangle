import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Pipe({ name: 'DisplayBalance' })
export class DisplayBalancePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}
    transform(balance: number): string {
        if (balance >= 0) {
            return balance.toString();
        }
        else {
            return balance + ' (-ve)';
        }
    }
}
