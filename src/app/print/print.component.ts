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
    printMarksheetSubscription: any;
    printMarksheetSecondFormatSubscription: any;
    printTransferCertificateSubscription: any;
    printStudentListSubscription: any;
    printEmployeeListSubscription: any;
    printNewFeeReceiptSubscription: any;

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
        this.printMarksheetSubscription = EmitterService.get('print-marksheet').subscribe( value => {
            this.printType = 'marksheet';
            setTimeout( () => {
                EmitterService.get('print-marksheet-component').emit(value);
            });
        });
        this.printMarksheetSecondFormatSubscription = EmitterService.get('print-marksheet-second-format').subscribe( value => {
            this.printType = 'marksheetSecondFormat';
            setTimeout( () => {
                EmitterService.get('print-marksheet-second-format-component').emit(value);
            });
        });
        this.printStudentListSubscription = EmitterService.get('print-student-list').subscribe( value => {
            this.printType = 'studentList';
            setTimeout( () => {
                EmitterService.get('print-student-list-component').emit(value);
            });
        });
        this.printEmployeeListSubscription = EmitterService.get('print-employee-list').subscribe( value => {
            this.printType = 'employeeList';
            setTimeout( () => {
                EmitterService.get('print-employee-list-component').emit(value);
            });
        });
        this.printTransferCertificateSubscription = EmitterService.get('print-transfer-certificate').subscribe( value => {
            this.printType = 'transferCertificate';
            setTimeout( () => {
                EmitterService.get('print-transfer-certificate-component').emit(value);
            });
        });
        this.printFeeReceiptSubscription = EmitterService.get('print-new-fee-receipt').subscribe( value => {
            this.printType = 'newFeeReceipt';
            setTimeout(() => {
                EmitterService.get('print-new-fee-receipt-component').emit(value);
            });
        });
    }

    ngOnDestroy(): void {
        this.printFeeReceiptSubscription.unsubscribe();
        this.printFeeRecordsSubscription.unsubscribe();
        this.printExpensesSubscription.unsubscribe();
        this.printMarksheetSubscription.unsubscribe();
        this.printMarksheetSecondFormatSubscription.unsubscribe();
        this.printStudentListSubscription.unsubscribe();
        this.printEmployeeListSubscription.unsubscribe();
        this.printNewFeeReceiptSubscription.unsubscribe();
    }

}
