import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-cancel-fee-receipt-modal',
    templateUrl: './cancel-fee-receipt-modal.component.html',
    styleUrls: ['./cancel-fee-receipt-modal.component.css'],
})
export class CancelFeeReceiptModalComponent implements OnInit {
    feeReceipt: any;
    user: any;
    totalAmount: any;
    collectedBy: any;
    studentName: string;
    fathersName: string;
    classSection: string;
    feeReceiptBookList: any;

    ngOnInit(): void {
        this.formControl.markAsTouched();
    }

    formControl = new FormControl('', [Validators.required]);

    constructor(public dialogRef: MatDialogRef<CancelFeeReceiptModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.feeReceipt = this.data.feeReceipt;
        this.user = this.data.user;
        this.studentName = this.data.studentName;
        this.fathersName = this.data.fathersName;
        this.classSection = this.data.classSection;
        this.totalAmount = this.data.totalAmount;
        this.collectedBy = this.data.collectedBy;
        this.feeReceiptBookList = this.data.feeReceiptBookList;
    }

    getFeeReceiptNo(feeReceipt: any): any {
        return this.feeReceiptBookList.find(feeReceiptBook => {
            return feeReceiptBook.id == feeReceipt.parentFeeReceiptBook;
        }).receiptNumberPrefix + feeReceipt.receiptNumber;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
