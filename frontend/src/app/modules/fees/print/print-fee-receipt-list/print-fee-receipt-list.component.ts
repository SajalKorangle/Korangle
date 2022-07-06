import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';
import { INSTALLMENT_LIST } from '../../classes/constants';
import { PrintService } from '../../../../print/print-service';

@Component({
    templateUrl: './print-fee-receipt-list.component.html',
    styleUrls: ['./print-fee-receipt-list.component.css'],
})
export class PrintFeeReceiptListComponent implements OnInit, AfterViewChecked {
    installmentList = INSTALLMENT_LIST;
    sessionList = [];

    user: any;

    data: any;

    checkView = false;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) {}

    ngOnInit(): void {
        const { user, value } = this.printService.getData();
        console.log(value);
        this.user = user;
        this.data = value;
        this.sessionList = this.data.sessionList;
        this.checkView = true;
    }

    ngAfterViewChecked(): void {
        if (this.checkView) {
            this.checkView = false;
            this.printService.print();
            this.data = null;
            this.cdRef.detectChanges();
        }
    }

    getFeeReceiptTotalAmount(feeReceipt: any): number {
        let currentList = [];
        if (this.data.filteredFeeTypeList != undefined) {
            this.data.filteredFeeTypeList.forEach((feeType) => {
                if (feeType.selectedFeeType) {
                    this.data.subFeeReceiptList.forEach((subFeeReceipt) => {
                        if (subFeeReceipt.parentFeeType == feeType.id && subFeeReceipt.parentFeeReceipt == feeReceipt.id) {
                            currentList.push(subFeeReceipt);
                        }
                    });
                }
            });
        }
        let filteredAmount = 0;
        currentList.forEach((subFeeReceipt) => {
           filteredAmount += this.installmentList.reduce((totalInstallment, installment) => {
                        return (
                            totalInstallment +
                            (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0) +
                            (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0)
                        );
           }, 0);
        });
        return filteredAmount;


        // return this.data.subFeeReceiptList
        //     .filter((subFeeReceipt) => {
        //         return subFeeReceipt.parentFeeReceipt == feeReceipt.id;
        //     })
        //     .reduce((totalSubFeeReceipt, subFeeReceipt) => {
        //         return (
        //             totalSubFeeReceipt +
        //             this.installmentList.reduce((totalInstallment, installment) => {
        //                 return (
        //                     totalInstallment +
        //                     (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0) +
        //                     (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0)
        //                 );
        //             }, 0)
        //         );
        //     }, 0);
    }

    getFeeReceiptListTotalAmount(): any {
        return this.data.feeReceiptList.reduce((total, feeReceipt) => {
            return total + this.getFeeReceiptTotalAmount(feeReceipt);
        }, 0);
    }
}
