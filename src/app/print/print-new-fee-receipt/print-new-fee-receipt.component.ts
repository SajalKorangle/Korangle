import { Component, OnInit, Input, OnDestroy, AfterViewChecked } from '@angular/core';

import { TempFee } from '../../fees/classes/temp-fee';

import { EmitterService } from '../../services/emitter.service';

@Component({
    selector: 'app-print-new-fee-receipt',
    templateUrl: './print-new-fee-receipt.component.html',
    styleUrls: ['./print-new-fee-receipt.component.css'],
})
export class PrintNewFeeReceiptComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() user;

    feeReceipt: TempFee;

    printNewFeeReceiptComponentSubscription: any;

    checkView = false;

    ngOnInit(): void {
        this.feeReceipt = new TempFee();
        this.printNewFeeReceiptComponentSubscription = EmitterService.get('print-new-fee-receipt-component').subscribe( value => {
            this.feeReceipt.copy(value);
            this.checkView = true;
        });
    }

    ngAfterViewChecked(): void {
        if(this.checkView) {
            this.checkView = false;
            setTimeout(() => {
                window.print();
            });
        }
    }

    ngOnDestroy(): void {
        this.printNewFeeReceiptComponentSubscription.unsubscribe();
    }

}
