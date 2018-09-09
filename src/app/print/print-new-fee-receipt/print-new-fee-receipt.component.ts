import { Component, OnInit, Input, OnDestroy, AfterViewChecked } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { EmitterService } from '../../services/emitter.service';
import {FREQUENCY_LIST} from '../../modules/fees-second/classes/constants';
import {FeeReceipt} from '../../modules/fees-second/classes/common-functionalities';

@Component({
    selector: 'app-print-new-fee-receipt',
    templateUrl: './print-new-fee-receipt.component.html',
    styleUrls: ['./print-new-fee-receipt.component.css'],
})
export class PrintNewFeeReceiptComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() user;

    feeReceipt: any;
    sectionName: any;

    printNewFeeReceiptComponentSubscription: any;

    checkView = false;

    constructor(private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        // this.feeReceipt = new TempFee();
        this.printNewFeeReceiptComponentSubscription = EmitterService.get('print-new-fee-receipt-component').subscribe( value => {
            // this.feeReceipt.copy(value);
            this.feeReceipt = value['feeReceipt'];
            this.sectionName = value['sectionName'];
            this.checkView = true;
        });
    }

    ngAfterViewChecked(): void {
        if(this.checkView) {
            this.checkView = false;
            window.print();
            this.feeReceipt = null;
            this.sectionName = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.printNewFeeReceiptComponentSubscription.unsubscribe();
    }

    getSubFeeReceiptAmount(subFeeReceipt: any): number {
        return FeeReceipt.getSubFeeReceiptAmount(subFeeReceipt);
    }

    getTotalFeeReceiptAmount(): number {
        return FeeReceipt.getFeeReceiptTotalAmount(this.feeReceipt);
    }

    getMonthRange(subFeeReceipt: any): string {
        if (subFeeReceipt.frequency === FREQUENCY_LIST[0]) {
            return '';
        } else if (subFeeReceipt.frequency === FREQUENCY_LIST[1]) {
            let startingMonth = '', endingMonth = '';
            subFeeReceipt['monthList'].forEach( month => {
                if (month.amount > 0) {
                    if (startingMonth === '') {
                        startingMonth = month['month'];
                        endingMonth = month['month'];
                    } else {
                        endingMonth = month['month'];
                    }
                }
            });
            if (startingMonth === endingMonth) {
                return this.getMonthAbbreviation(startingMonth);
            } else {
                return this.getMonthAbbreviation(startingMonth) + ' - ' + this.getMonthAbbreviation(endingMonth);
            }
        }
    }

    getMonthAbbreviation(monthName: string): string {
        if (monthName.length === 3) {
            return monthName;
        } else {
            return monthName.substr(0,3) + '.';
        }
    }

}
