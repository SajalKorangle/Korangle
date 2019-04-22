import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule  } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ShowHidePasswordModule } from 'ngx-show-hide-password';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { LoginComponent } from './authentication/login.component';

import { PrintComponent } from './print/print.component';
import { PrintFeeReceiptComponent } from './print/print-fee-receipt/print-fee-receipt.component';
import { PrintFeeRecordsComponent } from './print/print-fee-records/print-fee-records.component';
import { PrintMarksheetComponent } from './print/print-marksheet/print-marksheet.component';
import { PrintMarksheetSecondFormatComponent } from './print/print-marksheet-second-format/print-marksheet-second-format.component';
import { PrintTransferCertificateComponent } from './print/print-transfer-certificate/print-transfer-certificate.component';
import { PrintTransferCertificateSecondFormatComponent } from './modules/students/print/print-transfer-certificate-second-format/print-transfer-certificate-second-format.component';
import { PrintNewFeeReceiptComponent } from './print/print-new-fee-receipt/print-new-fee-receipt.component';
import { PrintExpensesComponent } from './print/print-expenses/print-expenses.component';
import { PrintStudentListComponent } from './print/print-student-list/print-student-list.component';
import { PrintICardsComponent } from './modules/students/print/print-i-card/print-i-cards.component';
import { PrintHallTicketComponent } from './modules/examination/print/print-hall-ticket/print-hall-ticket.component';
import { PrintStudentAttendanceListComponent } from './modules/attendance/print/print-student-attendance-list/print-student-attendance-list.component';
import { PrintEmployeeAttendanceListComponent } from './modules/attendance/print/print-employee-attendance-list/print-employee-attendance-list.component';
import { PrintEmployeeListComponent } from './print/print-employee-list/print-employee-list.component';
import { PrintStudentMarksheetListComponent } from './modules/examination/print/print-student-marksheet-list/print-student-marksheet-list.component';
import { PrintSalarySheetComponent } from './modules/salary/print/print-salary-sheet/print-salary-sheet.component';
import { PrintStudentComprehensiveFinalReportListComponent } from './modules/examination/print/print-student-comprehensive-final-report-list/print-student-comprehensive-final-report-list.component';
import { PrintStudentElegantFinalReportListComponent } from './modules/examination/print/print-student-elegant-final-report-list/print-student-elegant-final-report-list.component';
import { PrintStudentNinthFinalReportListComponent } from './modules/examination/print/print-student-ninth-final-report-list/print-student-ninth-final-report-list.component';
import { PrintStudentClassicFinalReportListComponent } from './modules/examination/print/print-student-classic-final-report-list/print-student-classic-final-report-list.component';
import {PrintStudentEleventhFinalReportListComponent} from './modules/examination/print/print-student-eleventh-final-report-list/print-student-eleventh-final-report-list.component';
import {PrintFeeReceiptListComponent} from './modules/fees-second/print/print-fee-receipt-list/print-fee-receipt-list.component';
import {PrintEmployeeICardsComponent} from './modules/employee/print/print-employee-i-card/print-employee-i-cards.component';

@NgModule({
    declarations: [
        AppComponent,

        LoginComponent,

        PrintFeeReceiptComponent,
        PrintFeeRecordsComponent,
        PrintExpensesComponent,
        PrintMarksheetComponent,
        PrintMarksheetSecondFormatComponent,
        PrintTransferCertificateComponent,
        PrintTransferCertificateSecondFormatComponent,
        PrintStudentListComponent,
        PrintFeeReceiptListComponent,
        PrintEmployeeListComponent,
        PrintNewFeeReceiptComponent,
        PrintICardsComponent,
        PrintHallTicketComponent,
        PrintStudentMarksheetListComponent,
        PrintStudentAttendanceListComponent,
        PrintEmployeeAttendanceListComponent,
        PrintSalarySheetComponent,
        PrintStudentComprehensiveFinalReportListComponent,
        PrintStudentElegantFinalReportListComponent,
        PrintStudentNinthFinalReportListComponent,
        PrintStudentEleventhFinalReportListComponent,
        PrintStudentClassicFinalReportListComponent,
        PrintComponent,
        PrintEmployeeICardsComponent
    ],
    imports: [
        ComponentsModule,
        AppRoutingModule,
        HttpModule,
        BrowserModule,
        ShowHidePasswordModule,
        BrowserAnimationsModule,
    ],
    exports: [
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
