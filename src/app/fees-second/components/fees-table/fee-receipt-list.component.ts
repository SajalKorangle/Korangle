import { Component, Input } from '@angular/core';

import {EmitterService} from '../../../services/emitter.service';
import {FeeReceipt} from '../../classes/common-functionalities';

@Component({
    selector: 'app-fee-receipt-list',
    templateUrl: './fee-receipt-list.component.html',
    styleUrls: ['./fee-receipt-list.component.css'],
})
export class FeeReceiptListComponent {

    @Input() user;
    @Input() feeReceiptList;
    @Input() whileSubmittingFee;

    printFeeReceipt(fee: any): void {
        EmitterService.get('print-new-fee-receipt').emit(fee);
    }

    getFeeReceiptTotalAmount(feeReceipt: any): number {
        return FeeReceipt.getFeeReceiptTotalAmount(feeReceipt);
    }

}
