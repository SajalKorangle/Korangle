import { Component, OnInit, Input, OnDestroy, AfterViewChecked } from '@angular/core';

import { TempFee } from '../../fees/classes/temp-fee';

import { EmitterService } from '../../services/emitter.service';

@Component({
    selector: 'app-print-fee-receipt',
    templateUrl: './print-fee-receipt.component.html',
    styleUrls: ['./print-fee-receipt.component.css'],
})
export class PrintFeeReceiptComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() user;

    feeReceipt: TempFee;

    printFeeReceiptComponentSubscription: any;

    checkView = false;

    ngOnInit(): void {
        this.feeReceipt = new TempFee();
        this.printFeeReceiptComponentSubscription = EmitterService.get('print-fee-receipt-component').subscribe( value => {
            this.feeReceipt.copy(value);
            this.checkView = true;
        });
    }

    ngAfterViewChecked(): void {
        if (this.checkView) {
            this.checkView = false;
            setTimeout(() => {
                window.print();
            });
        }
    }

    ngOnDestroy(): void {
        this.printFeeReceiptComponentSubscription.unsubscribe();
    }

}
