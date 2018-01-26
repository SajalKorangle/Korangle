import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { EmitterService } from '../services/emitter.service';

@Component({
    selector: 'app-print',
    templateUrl: './print.component.html',
    styleUrls: ['./print.component.css'],
})
export class PrintComponent implements OnInit, OnDestroy {

    @Input() user;

    printType = 'feeReceipt';

    printFeeReceiptSubscription: any;
    printFeeRecordsSubscription: any;
    printExpensesSubscription: any;

    ngOnInit(): void {
        this.printFeeReceiptSubscription = EmitterService.get('print-fee-receipt').subscribe( value => {
            this.printType = 'feeReceipt';
            setTimeout(() => {
                EmitterService.get('print-fee-receipt-component').emit(value);
            });
        });
        this.printFeeRecordsSubscription = EmitterService.get('print-fee-records').subscribe( value => {
            this.printType = 'feeRecords';
            setTimeout(() => {
                EmitterService.get('print-fee-records-component').emit(value);
            });
        });
        this.printExpensesSubscription = EmitterService.get('print-expenses').subscribe( value => {
            this.printType = 'expenses';
            setTimeout(() => {
                EmitterService.get('print-expenses-component').emit(value);
            });
        });
    }

    ngOnDestroy(): void {
        this.printFeeReceiptSubscription.unsubscribe();
        this.printFeeRecordsSubscription.unsubscribe();
        this.printExpensesSubscription.unsubscribe();
    }

}
