import { NgModule } from '@angular/core';

import { MatExpansionModule } from '@angular/material';
import { MatSortModule } from '@angular/material';

import { ComponentsModule } from '../../components/components.module';

import { FeeComponent } from './fee.component';

import { FeeRoutingModule } from './fee.routing';

import { PrintFeeReceiptListComponent } from './print/print-fee-receipt-list/print-fee-receipt-list.component';
import { PrintFullFeeReceiptListComponent } from './print/print-full-fee-receipt-list/print-full-fee-receipt-list.component';
import { ExcelService } from "../../excel/excel-service";
import {FeesComponentsModule} from "./components/fees-components.module";

@NgModule({
    declarations: [

        FeeComponent,

        PrintFeeReceiptListComponent,
        PrintFullFeeReceiptListComponent

    ],

    imports: [

        FeeRoutingModule,
        ComponentsModule,
        FeesComponentsModule,

        MatExpansionModule,
        MatSortModule,

    ],
    exports: [
    ],
    providers: [ExcelService],
    bootstrap: [FeeComponent]
})
export class FeeModule { }
