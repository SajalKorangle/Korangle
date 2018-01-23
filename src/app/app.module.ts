import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// import {MdTableModule} from '@angular/material';
// import {MdRadioGroup, MdRadioButton} from "@angular/material";
// import {MaterialModule} from '@angular/material';
// import { MatRadioGroup, MatRadioButton } from '@angular/material';
import { MatRadioModule } from '@angular/material';
import { MatSelectModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material';
// import { NoConflictStyleCompatibilityMode } from '@angular/material';
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
import { PrintFeeReceiptComponent } from './print/print-fee-receipt/print-fee-receipt.component';
import { PrintFeeRecordsComponent } from './print/print-fee-records/print-fee-records.component';

import { PrintExpensesComponent } from './print/print-expenses/print-expenses.component';
import { ExpensesComponent } from './expenses/expenses.component';

import { NewConcessionComponent } from './concession/new-concession/new-concession.component';
import { ConcessionListComponent } from './concession/concession-list/concession-list.component';

import { PrintComponent } from './print/print.component';
import { MoneyFormatPipe } from './pipes/money-format.pipe';

@NgModule({
    declarations: [
        AppComponent,

        FeesListComponent,
        NewFeesComponent,
        NewFeeReceiptComponent,

        ExpensesComponent,

        NewConcessionComponent,
        ConcessionListComponent,

        StudentProfileComponent,
        StudentListComponent,

        NewStudentComponent,

        LoginComponent,

        PrintFeeReceiptComponent,
        PrintFeeRecordsComponent,
        PrintExpensesComponent,
        PrintComponent,
        MoneyFormatPipe,
        // MdRadioGroup,
        // MdRadioButton,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        ComponentsModule,
        RouterModule,
        AppRoutingModule,
        // MdTableModule,
        BrowserAnimationsModule,
        CdkTableModule,
        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        // MaterialModule,
        // NoConflictStyleCompatibilityMode,
    ],
    exports: [
        CdkTableModule,
        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        // MdTableModule,
        // MaterialModule,
        // MdRadioGroup,
        // MdRadioButton,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
