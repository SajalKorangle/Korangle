import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { EmitterService } from '../../../../services/emitter.service';
import {FeeReceipt} from '../../classes/common-functionalities';

@Component({
    selector: 'app-print-fee-receipt-list',
    templateUrl: './print-fee-receipt-list.component.html',
    styleUrls: ['./print-fee-receipt-list.component.css'],
})
export class PrintFeeReceiptListComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() user;

    feeReceiptList: any;
    feeType: any;
    employee: any;

    viewChecked = true;

    printFeeReceiptListComponentSubscription: any;

    constructor(private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.printFeeReceiptListComponentSubscription = EmitterService.get('print-fee-receipt-list-component').subscribe(value => {
            this.feeReceiptList = value['feeReceiptList'];
            this.feeType = value['feeType'];
            this.employee = value['employee'];
            this.viewChecked = false;
        });
    }

    getFeeReceiptTotalAmount(feeReceipt: any): number {
        return FeeReceipt.getFeeReceiptTotalAmount(feeReceipt, this.feeType.name);
    }

    getSchoolFeeTotalAmount(): number {
        let amount = 0;
        this.feeReceiptList.forEach( feeReceipt => {
            amount += FeeReceipt.getFeeReceiptTotalAmount(feeReceipt, this.feeType.name);
        });
        return amount;
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            window.print();
            this.feeReceiptList = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.printFeeReceiptListComponentSubscription.unsubscribe();
    }

}
