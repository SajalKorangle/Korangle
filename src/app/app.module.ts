import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import {MdTableModule} from '@angular/material';
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
import { StudentComponent } from './students/students.component';
import { NewStudentComponent } from './new-student/new-student.component';
import { LoginComponent } from './authentication/login.component';
import { PrintFeeReceiptComponent } from './print/print-fee-receipt/print-fee-receipt.component';
import { PrintFeeRecordsComponent } from './print/print-fee-records/print-fee-records.component';
import { PrintExpensesComponent } from './print/print-expenses/print-expenses.component';
import { FeesComponent } from './fees/fees.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { ConcessionComponent } from './concession/concession.component';
import { PrintComponent } from './print/print.component';
import { MoneyFormatPipe } from './pipes/money-format.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FeesComponent,
      ExpensesComponent,
      ConcessionComponent,
    /*UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
      FeesReceiptsComponent,
      StudentListComponent,*/
      StudentComponent,
      NewStudentComponent,
      LoginComponent,
      PrintFeeReceiptComponent,
      PrintFeeRecordsComponent,
      PrintExpensesComponent,
      PrintComponent,
      MoneyFormatPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ComponentsModule,
      RouterModule,
    AppRoutingModule,
      MdTableModule,
      BrowserAnimationsModule,
      CdkTableModule,
  ],
    exports: [
        CdkTableModule,
      MdTableModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
