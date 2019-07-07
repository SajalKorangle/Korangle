import { NgModule } from '@angular/core';

import { MatExpansionModule } from '@angular/material';
import { MatSortModule } from '@angular/material';

import { ComponentsModule } from '../../components/components.module';

import { FeeComponent } from './fee.component';

import { ApproveFeesComponent } from './pages/approve-fees/approve-fees.component';
import { CollectFeeComponent } from './pages/collect-fee/collect-fee.component';
import { MyCollectionComponent } from './pages/my-collection/my-collection.component';
import { GiveDiscountComponent } from './pages/give-discount/give-discount.component';
import { SchoolRecordComponent } from './pages/school-record/school-record.component';
import { SetSchoolFeesComponent } from './pages/set-school-fees/set-school-fees.component';
import { TotalCollectionComponent } from './pages/total-collection/total-collection.component';
import { TotalDiscountComponent } from './pages/total-discount/total-discount.component';
import { UpdateStudentFeesComponent } from './pages/update-student-fees/update-student-fees.component';

import { MonthlyAmountComponent } from './components/monthly-amount/monthly-amount.component';
import { FeeStructureComponent } from './components/fee-structure/fee-structure.component';


import {FeeRoutingModule} from './fee.routing';
import { PrintOldFeeReceiptListComponent } from './print/print-old-fee-receipt-list/print-old-fee-receipt-list.component';
import { PrintFeeReceiptComponent } from './print/print-fee-receipt/print-fee-receipt.component';
import { PrintFeeRecordsComponent } from './print/print-fee-records/print-fee-records.component';
import { PrintNewFeeReceiptComponent } from './print/print-new-fee-receipt/print-new-fee-receipt.component';
import {ExcelService} from "../../excel/excel-service";


@NgModule({
    declarations: [

        FeeComponent,

        ApproveFeesComponent,
        CollectFeeComponent,
        MyCollectionComponent,
        GiveDiscountComponent,
        SchoolRecordComponent,
        SetSchoolFeesComponent,
        TotalCollectionComponent,
        TotalDiscountComponent,
        UpdateStudentFeesComponent,

        // FeeReceiptListComponent,
        // DiscountListComponent,
        MonthlyAmountComponent,
        FeeStructureComponent,

        PrintOldFeeReceiptListComponent,
        PrintFeeReceiptComponent,
        PrintFeeRecordsComponent,
        PrintNewFeeReceiptComponent

    ],

    imports: [

        FeeRoutingModule,
        ComponentsModule,

        MatExpansionModule,
        MatSortModule,

    ],
    exports: [
    ],
    providers: [ExcelService],
    bootstrap: [FeeComponent]
})
export class FeeModule { }
