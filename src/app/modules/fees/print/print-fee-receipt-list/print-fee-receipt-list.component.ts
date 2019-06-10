import { Component, OnInit, Input, OnDestroy, AfterViewChecked } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';
import {EmitterService} from "../../../../services/emitter.service";
import {INSTALLMENT_LIST} from "../../classes/constants";
import {SESSION_LIST} from "../../../../classes/constants/session";

@Component({
    selector: 'app-print-fee-receipt-list',
    templateUrl: './print-fee-receipt-list.component.html',
    styleUrls: ['./print-fee-receipt-list.component.css'],
})

export class PrintFeeReceiptListComponent implements OnInit, OnDestroy, AfterViewChecked {

    installmentList = INSTALLMENT_LIST;
    sessionList = SESSION_LIST;

    @Input() user;

    data: any;

    printFeeReceiptListComponentSubscription: any;

    checkView = false;

    constructor(private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.printFeeReceiptListComponentSubscription =
            EmitterService.get('print-fee-receipt-list-component').subscribe(value => {
                this.data = value;
                this.checkView = true;
        });
    }

    ngAfterViewChecked(): void {
        if(this.checkView) {
            this.checkView = false;
            window.print();
            this.data = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.printFeeReceiptListComponentSubscription.unsubscribe();
    }

    getFeeReceiptTotalAmount(feeReceipt: any): number {
        return this.data.subFeeReceiptList.filter(subFeeReceipt => {
            return subFeeReceipt.parentFeeReceipt == feeReceipt.id;
        }).reduce((totalSubFeeReceipt, subFeeReceipt) => {
            return totalSubFeeReceipt + this.installmentList.reduce((totalInstallment, installment) => {
                return totalInstallment
                    + (subFeeReceipt[installment+'Amount']?subFeeReceipt[installment+'Amount']:0)
                    + (subFeeReceipt[installment+'LateFee']?subFeeReceipt[installment+'LateFee']:0);
            }, 0);
        }, 0);
    }

    getFeeReceiptListTotalAmount(): any {
        return this.data.feeReceiptList.reduce((total, feeReceipt) => {
            return total + this.getFeeReceiptTotalAmount(feeReceipt);
        }, 0);
    }

}
