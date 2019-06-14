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
import { PrintNewFeeReceiptComponent } from './print/print-new-fee-receipt/print-new-fee-receipt.component';
import { PrintExpensesComponent } from './print/print-expenses/print-expenses.component';
import { PrintStudentListComponent } from './print/print-student-list/print-student-list.component';
import { PrintEmployeeListComponent } from './print/print-employee-list/print-employee-list.component';
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
        PrintStudentListComponent,
        PrintEmployeeListComponent,
        PrintNewFeeReceiptComponent,
        PrintComponent
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
