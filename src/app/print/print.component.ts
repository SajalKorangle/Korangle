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
    printTransferCertificateSecondFormatSubscription: any;
    printStudentListSubscription: any;
    printOldFeeReceiptListSubscription: any;
    printFeeReceiptListSubscription: any;
    printEmployeeListSubscription: any;
    printNewFeeReceiptSubscription: any;
    printHallTicketSubscription: any;
    printStudentMarksheetListSubscription: any;
    printStudentComprehensiveFinalReportListSubscription: any;
    printStudentElegantFinalReportListSubscription: any;
    printStudentNinthFinalReportListSubscription: any;
    printStudentEleventhFinalReportListSubscription: any;
    printStudentClassicFinalReportListSubscription: any;
    printSalarySheetSubscription: any;
    printStudentAttendanceListSubscription: any;
    printEmployeeAttendanceListSubscription: any;
    printFullFeeReceiptListSubscription: any;

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
        this.printOldFeeReceiptListSubscription = EmitterService.get('print-old-fee-receipt-list').subscribe(value => {
            this.printType = 'oldFeeReceiptList';
            setTimeout( () => {
                EmitterService.get('print-old-fee-receipt-list-component').emit(value);
            });
        });
        this.printFeeReceiptListSubscription = EmitterService.get('print-fee-receipt-list').subscribe(value => {
            this.printType = 'feeReceiptList';
            setTimeout( () => {
                EmitterService.get('print-fee-receipt-list-component').emit(value);
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
        this.printTransferCertificateSecondFormatSubscription = EmitterService.get('print-transfer-certificate-second-format').subscribe( value => {
            this.printType = 'transferCertificateSecondFormat';
            setTimeout( () => {
                EmitterService.get('print-transfer-certificate-second-format-component').emit(value);
            });
        });
        this.printFeeReceiptSubscription = EmitterService.get('print-new-fee-receipt').subscribe( value => {
            this.printType = 'newFeeReceipt';
            setTimeout(() => {
                EmitterService.get('print-new-fee-receipt-component').emit(value);
            });
        });
        this.printHallTicketSubscription = EmitterService.get('print-hall-ticket').subscribe(value => {
            this.printType = 'hallTicket';
            setTimeout(() => {
                EmitterService.get('print-hall-ticket-component').emit(value);
            });
        });
        this.printStudentMarksheetListSubscription = EmitterService.get('print-student-marksheet-list').subscribe(value => {
            this.printType = 'studentMarksheetList';
            setTimeout(() => {
                EmitterService.get('print-student-marksheet-list-component').emit(value);
            });
        });
        this.printStudentComprehensiveFinalReportListSubscription = EmitterService.get('print-student-comprehensive-final-report-list').subscribe(value => {
            this.printType = 'studentComprehensiveFinalReportList';
            setTimeout(() => {
                EmitterService.get('print-student-comprehensive-final-report-list-component').emit(value);
            });
        });
        this.printStudentElegantFinalReportListSubscription = EmitterService.get('print-student-elegant-final-report-list').subscribe(value => {
            this.printType = 'studentElegantFinalReportList';
            setTimeout(() => {
                EmitterService.get('print-student-elegant-final-report-list-component').emit(value);
            });
        });
        this.printStudentNinthFinalReportListSubscription = EmitterService.get('print-student-ninth-final-report-list').subscribe(value => {
            this.printType = 'studentNinthFinalReportList';
            setTimeout(() => {
                EmitterService.get('print-student-ninth-final-report-list-component').emit(value);
            });
        });
        this.printStudentEleventhFinalReportListSubscription = EmitterService.get('print-student-eleventh-final-report-list').subscribe(value => {
            this.printType = 'studentEleventhFinalReportList';
            setTimeout(() => {
                EmitterService.get('print-student-eleventh-final-report-list-component').emit(value);
            });
        });
        this.printStudentClassicFinalReportListSubscription = EmitterService.get('print-student-classic-final-report-list').subscribe(value => {
            this.printType = 'studentClassicFinalReportList';
            setTimeout(() => {
                EmitterService.get('print-student-classic-final-report-list-component').emit(value);
            });
        });
        this.printSalarySheetSubscription = EmitterService.get('print-salary-sheet').subscribe(value => {
            this.printType = 'salarySheet';
            setTimeout(() => {
                EmitterService.get('print-salary-sheet-component').emit(value);
            });
        });
        this.printStudentAttendanceListSubscription =
            EmitterService.get('print-student-attendance-list').subscribe( value => {
                this.printType = 'studentAttendanceList';
                setTimeout( () => {
                    EmitterService.get('print-student-attendance-list-component').emit(value);
                });
        });
        this.printEmployeeAttendanceListSubscription =
            EmitterService.get('print-employee-attendance-list').subscribe( value => {
                this.printType = 'employeeAttendanceList';
                setTimeout( () => {
                    EmitterService.get('print-employee-attendance-list-component').emit(value);
                });
            });
        this.printFullFeeReceiptListSubscription = EmitterService.get('print-full-fee-receipt-list').subscribe(value => {
            this.printType = 'fullFeeReceiptList';
            setTimeout(() => {
                EmitterService.get('print-full-fee-receipt-list-component').emit(value);
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
        this.printOldFeeReceiptListSubscription.unsubscribe();
        this.printFeeReceiptListSubscription.unsubscribe();
        this.printEmployeeListSubscription.unsubscribe();
        this.printNewFeeReceiptSubscription.unsubscribe();
        this.printHallTicketSubscription.unsubscribe();
        this.printStudentMarksheetListSubscription.unsubscribe();
        this.printStudentComprehensiveFinalReportListSubscription.unsubscribe();
        this.printStudentElegantFinalReportListSubscription.unsubscribe();
        this.printStudentNinthFinalReportListSubscription.unsubscribe();
        this.printStudentEleventhFinalReportListSubscription.unsubscribe();
        this.printStudentClassicFinalReportListSubscription.unsubscribe();
        this.printSalarySheetSubscription.unsubscribe();
        this.printStudentAttendanceListSubscription.unsubscribe();
        this.printEmployeeAttendanceListSubscription.unsubscribe();
        this.printFullFeeReceiptListSubscription.unsubscribe();
    }

}
