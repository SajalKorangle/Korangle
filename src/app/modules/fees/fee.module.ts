import { NgModule } from '@angular/core';

import { MatExpansionModule } from '@angular/material';
import { MatSortModule } from '@angular/material';

import { ComponentsModule } from '../../components/components.module';

import { FeeComponent } from './fee.component';

import {FeeRoutingModule} from './fee.routing';

import { AddFeeTypeComponent } from './pages/add-fee-type/add-fee-type.component';
import {CancelDiscountComponent} from "./pages/cancel-discount/cancel-discount.component";
import {CancelFeeReceiptComponent} from "./pages/cancel-fee-receipt/cancel-fee-receipt.component";
import {CollectFeeComponent} from "./pages/collect-fee/collect-fee.component";
import {GenerateFeesCertificateComponent} from "./pages/generate-fees-certificate/generate-fees-certificate.component";
import {GenerateFeesReportComponent} from "./pages/generate-fees-report/generate-fees-report.component";
import {GiveDiscountComponent} from "./pages/give-discount/give-discount.component";
import {LockFeesComponent} from "./pages/lock-fees/lock-fees.component";
import {MyCollectionComponent} from "./pages/my-collection/my-collection.component";
import {SetSchoolFeesComponent} from "./pages/set-school-fees/set-school-fees.component";
import {TotalCollectionComponent} from "./pages/total-collection/total-collection.component";
import {TotalDiscountComponent} from "./pages/total-discount/total-discount.component";
import {UpdateStudentFeesComponent} from "./pages/update-student-fees/update-student-fees.component";
import {ViewDefaultersComponent} from "./pages/view-defaulters/view-defaulters.component";
import { PrintFeeReceiptListComponent } from './print/print-fee-receipt-list/print-fee-receipt-list.component';
import { PrintFullFeeReceiptListComponent } from './print/print-full-fee-receipt-list/print-full-fee-receipt-list.component';


@NgModule({
    declarations: [

        FeeComponent,

        AddFeeTypeComponent,
        CancelDiscountComponent,
        CancelFeeReceiptComponent,
        CollectFeeComponent,
        GenerateFeesCertificateComponent,
        GenerateFeesReportComponent,
        GiveDiscountComponent,
        LockFeesComponent,
        MyCollectionComponent,
        SetSchoolFeesComponent,
        TotalCollectionComponent,
        TotalDiscountComponent,
        UpdateStudentFeesComponent,
        ViewDefaultersComponent,

        PrintFeeReceiptListComponent,
        PrintFullFeeReceiptListComponent

    ],

    imports: [

        FeeRoutingModule,
        ComponentsModule,

        MatExpansionModule,
        MatSortModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [FeeComponent]
})
export class FeeModule { }
