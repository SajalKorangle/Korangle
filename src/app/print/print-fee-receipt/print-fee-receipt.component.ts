import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Fee } from '../../classes/fee';

import { EmitterService } from '../../services/emitter.service';

@Component({
    selector: 'app-print-fee-receipt',
    templateUrl: './print-fee-receipt.component.html',
    styleUrls: ['./print-fee-receipt.component.css'],
})
export class PrintFeeReceiptComponent implements OnInit, OnDestroy {

    @Input() user;

    feeReceipt: Fee;

    printFeeReceiptComponentSubscription: any;

    ngOnInit(): void {
        this.feeReceipt = new Fee();
        this.printFeeReceiptComponentSubscription = EmitterService.get('print-fee-receipt-component').subscribe( value => {
            this.feeReceipt.copy(value);
            setTimeout(() => {
                window.print();
            });
        });
    }

    ngOnDestroy(): void {
        this.printFeeReceiptComponentSubscription.unsubscribe();
    }

}
