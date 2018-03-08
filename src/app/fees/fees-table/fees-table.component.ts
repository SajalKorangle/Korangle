import { Component, Input } from '@angular/core';

import { Fee } from '../../classes/fee';
import {EmitterService} from '../../services/emitter.service';

@Component({
    selector: 'app-fees-table',
    templateUrl: './fees-table.component.html',
    styleUrls: ['./fees-table.component.css'],
})
export class FeesTableComponent {

    @Input() user;
    @Input() feesList;
    @Input() whileSubmittingFee;

    printFeeReceipt(fee: Fee): void {
        EmitterService.get('print-fee-receipt').emit(fee);
    }

}
