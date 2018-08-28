import { Component, Input } from '@angular/core';

import {EmitterService} from '../../services/emitter.service';
import {FeeReceipt} from '../../modules/fees-second/classes/common-functionalities';

@Component({
    selector: 'app-fee-receipt-list',
    templateUrl: './fee-receipt-list.component.html',
    styleUrls: ['./fee-receipt-list.component.css'],
})
export class FeeReceiptListComponent {

    @Input() user;
    @Input() feeReceiptList;
    @Input() whileSubmittingFee;
    @Input() feeType = {
        dbId: 0,
        name: 'All',
    };

    number = 3;

    printFeeReceipt(fee: any): void {
        EmitterService.get('print-new-fee-receipt').emit(fee);
    }

    getFeeReceiptTotalAmount(feeReceipt: any): number {
        return FeeReceipt.getFeeReceiptTotalAmount(feeReceipt, this.feeType.name);
    }

    increaseNumber(): void {
        this.number += 3;
    }

}
