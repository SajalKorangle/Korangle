import { NgModule } from '@angular/core';

import { MatExpansionModule } from '@angular/material';
import { MatSortModule } from '@angular/material';

import { ComponentsModule } from '../../components/components.module';

import { FeeComponent } from './fee.component';

import {FeeRoutingModule} from './fee.routing';

import { AddFeeTypeComponent } from './pages/add-fee-type/add-fee-type.component';
import {CancelDiscountComponent} from "./pages/cancel-discount/cancel-discount.component";
import {CancelFeeReceiptComponent} from "./pages/cancel-fee-receipt/cancel-fee-receipt.component";
import {CollectStudentFeeComponent} from "./pages/collect-student-fee/collect-student-fee.component";
import {GenerateFeesCertificateComponent} from "./pages/generate-fees-certificate/generate-fees-certificate.component";
import {GenerateFeesReportComponent} from "./pages/generate-fees-report/generate-fees-report.component";
import {GiveStudentDiscountComponent} from "./pages/give-student-discount/give-student-discount.component";
import {GiveParentDiscountComponent} from "./pages/give-parent-discount/give-parent-discount.component";
import {LockFeesComponent} from "./pages/lock-fees/lock-fees.component";
import {MyCollectionComponent} from "./pages/my-collection/my-collection.component";
import {SetSchoolFeesComponent} from "./pages/set-school-fees/set-school-fees.component";
import {TotalCollectionComponent} from "./pages/total-collection/total-collection.component";
import {TotalDiscountComponent} from "./pages/total-discount/total-discount.component";
import {UpdateStudentFeesComponent} from "./pages/update-student-fees/update-student-fees.component";
import {ViewDefaultersComponent} from "./pages/view-defaulters/view-defaulters.component";

import {FeeReceiptListComponent} from "./components/fee-receipt-list/fee-receipt-list-component.component";
import {DiscountListComponent} from "./components/discount-list/discount-list-component.component";


@NgModule({
    declarations: [

        FeeComponent,

        AddFeeTypeComponent,
        CancelDiscountComponent,
        CancelFeeReceiptComponent,
        CollectStudentFeeComponent,
        GenerateFeesCertificateComponent,
        GenerateFeesReportComponent,
        GiveStudentDiscountComponent,
        GiveParentDiscountComponent,
        LockFeesComponent,
        MyCollectionComponent,
        SetSchoolFeesComponent,
        TotalCollectionComponent,
        TotalDiscountComponent,
        UpdateStudentFeesComponent,
        ViewDefaultersComponent,

        FeeReceiptListComponent,
        DiscountListComponent,

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
