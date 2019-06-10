import { Component, Input } from '@angular/core';

import {Concession} from '../../modules/fees-second/classes/common-functionalities';

@Component({
    selector: 'app-discount-list-old',
    templateUrl: './discount-list-old.component.html',
    styleUrls: ['./discount-list-old.component.css'],
})
export class DiscountListOldComponent {

    @Input() user;
    @Input() concessionList;
    @Input() whileSubmittingConcession;

    getConcessionTotalAmount(concession: any): number {
        return Concession.getConcessionTotalAmount(concession);
    }

}
