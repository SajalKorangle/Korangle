import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'moneyFormat'})
export class MoneyFormatPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer){}
  transform(money) {
		// console.log(html);
		/*if(html == "" || html == null || html == "<div>&nbsp;</div>") {
			return onEmpty;
		}*/
		return 'Rs. ' + money;
  }
}
