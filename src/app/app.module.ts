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
import { MatAutocompleteModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatIconModule } from '@angular/material';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CdkTableModule} from '@angular/cdk/table';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

//

import { StudentProfileComponent } from './students/pages/student-profile/student-profile.component';
import { StudentListComponent } from './students/pages/student-list/student-list.component';
import { GenerateTcComponent } from './students/pages/generate-tc/generate-tc.component';
import { PromoteStudentComponent } from './students/pages/promote-student/promote-student.component';

import { NewStudentComponent } from './new-student/new-student.component';

import { LoginComponent } from './authentication/login.component';

import { CollectFeeComponent } from './fees-second/pages/collect-fee/collect-fee.component';
import { TotalCollectionComponent } from './fees-second/pages/total-collection/total-collection.component';
import { SchoolRecordComponent } from './fees-second/pages/school-record/school-record.component';
import { UpdateStudentFeesComponent } from './fees-second/pages/update-student-fees/update-student-fees.component';
import { GiveDiscountComponent } from './fees-second/pages/give-discount/give-discount.component';
import { TotalDiscountComponent } from './fees-second/pages/total-discount/total-discount.component';
import { SetSchoolFeesComponent } from './fees-second/pages/set-school-fees/set-school-fees.component';
import {FeeReceiptListComponent} from './fees-second/components/fees-table/fee-receipt-list.component';
import { DiscountListComponent } from './fees-second/components/discount-table/discount-list.component';
import { MonthlyAmountComponent } from './fees-second/components/monthly-amount/monthly-amount.component';
import { FeeStructureComponent } from './fees-second/components/fee-structure/fee-structure.component';
import { ApproveFeesComponent } from './fees-second/pages/approve-fees/approve-fees.component';

import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

import { NewExpenseComponent } from './expenses/new-expense/new-expense.component';
import { ExpenseListComponent } from './expenses/expense-list/expense-list.component';

import { UpdateMarksComponent } from './marksheet/update-marks/update-marks.component';
import { MarksheetComponent } from './marksheet/print-marksheet/marksheet.component';

import { SchoolProfileComponent } from './school-profile/school-profile.component';

import { PrintComponent } from './print/print.component';
import { PrintFeeReceiptComponent } from './print/print-fee-receipt/print-fee-receipt.component';
import { PrintFeeRecordsComponent } from './print/print-fee-records/print-fee-records.component';
import { PrintMarksheetComponent } from './print/print-marksheet/print-marksheet.component';
import { PrintMarksheetSecondFormatComponent } from './print/print-marksheet-second-format/print-marksheet-second-format.component';
import { PrintTransferCertificateComponent } from './print/print-transfer-certificate/print-transfer-certificate.component';
import { PrintTransferCertificateSecondFormatComponent } from './students/print/print-transfer-certificate-second-format/print-transfer-certificate-second-format.component';
import { PrintNewFeeReceiptComponent } from './print/print-new-fee-receipt/print-new-fee-receipt.component';
import { PrintExpensesComponent } from './print/print-expenses/print-expenses.component';
import { PrintStudentListComponent } from './print/print-student-list/print-student-list.component';

import { MoneyFormatPipe } from './pipes/money-format.pipe';
import { AmountInWordsPipe } from './pipes/amount-in-words.pipe';
import { DateInWordsPipe } from './pipes/date-in-words.pipe';
import { GradePipe } from './pipes/grade.pipe';

/* Common Components */
import {StudentFilterComponent} from './components/student-filter/student-filter.component';

@NgModule({
    declarations: [
        AppComponent,

        /* Common Components */
        StudentFilterComponent,

        // FeesListComponent,
        // NewFeesComponent,
        // NewFeeReceiptComponent,

        FeeReceiptListComponent,
        DiscountListComponent,
        MonthlyAmountComponent,
        FeeStructureComponent,

        CollectFeeComponent,
        TotalCollectionComponent,
        SchoolRecordComponent,
        UpdateStudentFeesComponent,
        GiveDiscountComponent,
        TotalDiscountComponent,
        SetSchoolFeesComponent,
        ApproveFeesComponent,

        // FeesTableComponent,
        LoadingSpinnerComponent,

        // ExpensesComponent,
        NewExpenseComponent,
        ExpenseListComponent,

        // NewConcessionComponent,
        // ConcessionListComponent,

        UpdateMarksComponent,
        MarksheetComponent,

        StudentProfileComponent,
        StudentListComponent,
        GenerateTcComponent,
        PromoteStudentComponent,

        NewStudentComponent,

        SchoolProfileComponent,

        LoginComponent,

        PrintFeeReceiptComponent,
        PrintFeeRecordsComponent,
        PrintExpensesComponent,
        PrintMarksheetComponent,
        PrintMarksheetSecondFormatComponent,
        PrintTransferCertificateComponent,
        PrintTransferCertificateSecondFormatComponent,
        PrintStudentListComponent,
        PrintNewFeeReceiptComponent,
        PrintComponent,

        MoneyFormatPipe,
        AmountInWordsPipe,
        DateInWordsPipe,
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
        MatIconModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
