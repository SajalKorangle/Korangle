import { Component, Input } from '@angular/core';

import { Fee } from '../../classes/fee';
import {EmitterService} from '../../services/emitter.service';

@Component({
    selector: 'app-fees-table-list',
    templateUrl: './fees-table-list.component.html',
    styleUrls: ['./fees-table-list.component.css'],
})
export class FeesTableListComponent {

    @Input() user;
    @Input() feesList;
    @Input() whileSubmittingFee;

    printFeeReceipt(fee: Fee): void {
        EmitterService.get('print-fee-receipt').emit(fee);
    }

}
