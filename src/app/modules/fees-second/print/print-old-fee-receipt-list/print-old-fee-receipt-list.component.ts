import { Component, OnInit, AfterViewChecked } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import {FeeReceipt} from '../../classes/common-functionalities';
import { PrintService } from '../../../../print/print-service';

@Component({
    templateUrl: './print-old-fee-receipt-list.component.html',
    styleUrls: ['./print-old-fee-receipt-list.component.css'],
})
export class PrintOldFeeReceiptListComponent implements OnInit, AfterViewChecked {

    user : any;

    feeReceiptList: any;
    feeType: any;
    employee: any;

    viewChecked = true;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) { }

    ngOnInit(): void {
        const {user, value} = this.printService.getData();
        this.user = user;
        this.feeReceiptList = value['feeReceiptList'];
        this.feeType = value['feeType'];
        this.employee = value['employee'];
        this.viewChecked = false;
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
            this.printService.print();
            this.feeReceiptList = null;
            this.cdRef.detectChanges();
        }
    }

}
