import { Component, Input } from '@angular/core';

import {Concession} from '../../modules/fees-second/classes/common-functionalities';

@Component({
    selector: 'app-discount-list',
    templateUrl: './discount-list.component.html',
    styleUrls: ['./discount-list.component.css'],
})
export class DiscountListComponent {

    @Input() user;
    @Input() concessionList;
    @Input() whileSubmittingConcession;

    getConcessionTotalAmount(concession: any): number {
        return Concession.getConcessionTotalAmount(concession);
    }

}
