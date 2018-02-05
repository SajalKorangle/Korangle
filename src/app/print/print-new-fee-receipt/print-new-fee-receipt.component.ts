import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Fee } from '../../classes/fee';

import { EmitterService } from '../../services/emitter.service';

@Component({
    selector: 'app-print-new-fee-receipt',
    templateUrl: './print-new-fee-receipt.component.html',
    styleUrls: ['./print-new-fee-receipt.component.css'],
})
export class PrintNewFeeReceiptComponent implements OnInit, OnDestroy {

    @Input() user;

    feeReceipt: Fee;

    printNewFeeReceiptComponentSubscription: any;

    ngOnInit(): void {
        this.feeReceipt = new Fee();
        this.printNewFeeReceiptComponentSubscription = EmitterService.get('print-new-fee-receipt-component').subscribe( value => {
            setTimeout(() => {
                window.print();
            });
        });
    }

    ngOnDestroy(): void {
        this.printNewFeeReceiptComponentSubscription.unsubscribe();
    }

}
