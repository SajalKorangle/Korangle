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
import { PrintHallTicketComponent } from './modules/examination/print/print-hall-ticket/print-hall-ticket.component';
import { PrintEmployeeListComponent } from './print/print-employee-list/print-employee-list.component';
import { PrintStudentMarksheetListComponent } from './modules/examination/print/print-student-marksheet-list/print-student-marksheet-list.component';
import { PrintSalarySheetComponent } from './modules/salary/print/print-salary-sheet/print-salary-sheet.component';
import { PrintStudentComprehensiveFinalReportListComponent } from './modules/examination/print/print-student-comprehensive-final-report-list/print-student-comprehensive-final-report-list.component';
import { PrintStudentElegantFinalReportListComponent } from './modules/examination/print/print-student-elegant-final-report-list/print-student-elegant-final-report-list.component';
import { PrintStudentNinthFinalReportListComponent } from './modules/examination/print/print-student-ninth-final-report-list/print-student-ninth-final-report-list.component';
import { PrintStudentClassicFinalReportListComponent } from './modules/examination/print/print-student-classic-final-report-list/print-student-classic-final-report-list.component';
import {PrintStudentEleventhFinalReportListComponent} from './modules/examination/print/print-student-eleventh-final-report-list/print-student-eleventh-final-report-list.component';
import {PrintOldFeeReceiptListComponent} from './modules/fees-second/print/print-old-fee-receipt-list/print-old-fee-receipt-list.component';
import { PrintFeeReceiptListComponent } from "./modules/fees/print/print-fee-receipt-list/print-fee-receipt-list.component";
import {PrintFullFeeReceiptListComponent} from "./modules/fees/print/print-full-fee-receipt-list/print-full-fee-receipt-list.component";
import { PrintService } from './print/print-service';
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
        PrintOldFeeReceiptListComponent,
        PrintEmployeeListComponent,
        PrintNewFeeReceiptComponent,
        PrintHallTicketComponent,
        PrintStudentMarksheetListComponent,
        PrintSalarySheetComponent,
        PrintStudentComprehensiveFinalReportListComponent,
        PrintStudentElegantFinalReportListComponent,
        PrintStudentNinthFinalReportListComponent,
        PrintStudentEleventhFinalReportListComponent,
        PrintStudentClassicFinalReportListComponent,
        PrintComponent,
        PrintFullFeeReceiptListComponent,
        PrintFeeReceiptListComponent,

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
  providers: [ PrintService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
