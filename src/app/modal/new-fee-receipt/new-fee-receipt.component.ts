import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {EmitterService} from '../../services/emitter.service';

@Component({
    selector: 'app-new-fee-receipt-modal',
    templateUrl: './new-fee-receipt.component.html',
    styleUrls: ['./new-fee-receipt.component.css'],
})
export class NewFeeReceiptComponent implements OnInit, OnDestroy {

    @Input() user;
    newFeeReceipt: any;
    newFeeReceiptModalSubscription: any;

    ngOnInit(): void {
        EmitterService.get('new-fee-receipt-modal').subscribe(value => {
            this.newFeeReceipt = value;
            document.getElementById('openNewFeeReceiptModal').click();
        });
    }

    ngOnDestroy(): void {
        this.newFeeReceiptModalSubscription.unsubscribe();
    }

    submitFeeReceipt(): void {
        this.newFeeReceipt.amount = this.newFeeReceipt.tuitionFeeAmount
                                    + this.newFeeReceipt.lateFeeAmount
                                    + this.newFeeReceipt.cautionMoneyAmount;
        if (this.newFeeReceipt.receiptNumber === undefined || this.newFeeReceipt.receiptNumber === 0) {
            alert('Receipt No. should be populated');
            return;
        }
        if (this.newFeeReceipt.amount === undefined || this.newFeeReceipt.amount <= 0) {
            alert('Amount should be populated');
            return;
        }
        if (this.newFeeReceipt.generationDateTime === undefined) {
            alert('Date should be populated');
            return;
        }
        if (this.newFeeReceipt.remark === undefined) { this.newFeeReceipt.remark = ''; }
        document.getElementById('openNewFeeReceiptModal').click();
        EmitterService.get('submit-new-fee-receipt').emit('1');
    }

}
