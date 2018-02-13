import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { MatRadioModule } from '@angular/material';
import { MatSelectModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material';
import { MatTooltipModule } from '@angular/material';
import { MatMenuModule } from '@angular/material';
import { MatAutocompleteModule } from "@angular/material";
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CdkTableModule} from '@angular/cdk/table';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

/*import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from './table-list/table-list.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { FeesReceiptsComponent } from './fees-receipts/fees-receipts.component';
import { StudentListComponent } from './student-list/student-list.component';*/

import { StudentProfileComponent } from './students/student-profile/student-profile.component';
import { StudentListComponent } from './students/student-list/student-list.component';

import { NewStudentComponent } from './new-student/new-student.component';

import { LoginComponent } from './authentication/login.component';

import { NewFeeReceiptComponent } from './modal/new-fee-receipt/new-fee-receipt.component';
import { NewFeesComponent } from './fees/new-fees/new-fees.component';
import { FeesListComponent } from './fees/fees-list/fees-list.component';

import { FeesTableListComponent } from './fees/fees-table-list/fees-table-list.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

import { ExpensesComponent } from './expenses/expenses.component';

import { NewConcessionComponent } from './concession/new-concession/new-concession.component';
import { ConcessionListComponent } from './concession/concession-list/concession-list.component';

import { MarksheetComponent } from './marksheet/marksheet.component';

import { PrintComponent } from './print/print.component';
import { PrintFeeReceiptComponent } from './print/print-fee-receipt/print-fee-receipt.component';
import { PrintFeeRecordsComponent } from './print/print-fee-records/print-fee-records.component';
import { PrintMarksheetComponent } from './print/print-marksheet/print-marksheet.component';
import { PrintTransferCertificateComponent } from "./print/print-transfer-certificate/print-transfer-certificate.component";
import { PrintNewFeeReceiptComponent } from "./print/print-new-fee-receipt/print-new-fee-receipt.component";
import { PrintExpensesComponent } from './print/print-expenses/print-expenses.component';
import { PrintStudentListComponent } from './print/print-student-list/print-student-list.component';

import { MoneyFormatPipe } from './pipes/money-format.pipe';
import { AmountInWordsPipe } from './pipes/amount-in-words.pipe';
import { GradePipe } from './pipes/grade.pipe';

@NgModule({
    declarations: [
        AppComponent,

        FeesListComponent,
        NewFeesComponent,
        NewFeeReceiptComponent,

        FeesTableListComponent,
        LoadingSpinnerComponent,

        ExpensesComponent,

        NewConcessionComponent,
        ConcessionListComponent,

        MarksheetComponent,

        StudentProfileComponent,
        StudentListComponent,

        NewStudentComponent,

        LoginComponent,

        PrintFeeReceiptComponent,
        PrintFeeRecordsComponent,
        PrintExpensesComponent,
        PrintMarksheetComponent,
        PrintTransferCertificateComponent,
        PrintStudentListComponent,
        PrintNewFeeReceiptComponent,
        PrintComponent,

        MoneyFormatPipe,
        AmountInWordsPipe,
        GradePipe,
        // MdRadioGroup,
        // MdRadioButton,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        ComponentsModule,
        RouterModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        CdkTableModule,

        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatMenuModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    exports: [
        CdkTableModule,
        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatMenuModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
