import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-cancel-fee-receipt-modal',
  templateUrl: './cancel-fee-receipt-modal.component.html',
  styleUrls: ['./cancel-fee-receipt-modal.component.css']
})
export class CancelFeeReceiptModalComponent implements OnInit {

    feeReceipt:any;
    user:any;
    studentList:any;
    totalAmount:any;
    collectedBy:any;

    ngOnInit(): void {
    }

    formControl = new FormControl('', [
        Validators.required,
    ]);



    constructor(
        public dialogRef: MatDialogRef<CancelFeeReceiptModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.feeReceipt=this.data.feeReceipt;
        this.user=this.data.user;
        this.studentList=this.data.studentList;
        this.totalAmount=this.data.totalAmount;
        this.collectedBy=this.data.collectedBy;
    }

    getStudentName(studentId: number): any {
        return this.studentList.find(student => {
            return student.id == studentId;
        }).name;
    }

    onNoClick(): void {
    this.dialogRef.close();
  }

    getFatherName(studentId:number):any{
         return this.studentList.find(student => {
            return student.id == studentId;
        }).fathersName;
    }

}


