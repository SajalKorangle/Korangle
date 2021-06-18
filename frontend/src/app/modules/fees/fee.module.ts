import { NgModule } from '@angular/core';

import { MatExpansionModule } from '@angular/material';
import { MatSortModule } from '@angular/material';

import { ComponentsModule } from '../../components/components.module';

import { FeeComponent } from './fee.component';

import { FeeRoutingModule } from './fee.routing';

import { PrintFeeReceiptListComponent } from './print/print-fee-receipt-list/print-fee-receipt-list.component';
import { PrintFullFeeReceiptListComponent } from './print/print-full-fee-receipt-list/print-full-fee-receipt-list.component';
import { ExcelService } from '../../excel/excel-service';
import { FeesComponentsModule } from './components/fees-components.module';
import { PrintFeesCertificateComponent } from './print/print-fees-certificate/print-fees-certificate.component';
import { PrintFeesReportComponent } from './print/print-fees-report/print-fees-report.component';

@NgModule({
    declarations: [
        FeeComponent,

        PrintFeeReceiptListComponent,
        PrintFullFeeReceiptListComponent,
        PrintFeesCertificateComponent,
        PrintFeesReportComponent,
    ],

    imports: [FeeRoutingModule, ComponentsModule, FeesComponentsModule, MatExpansionModule, MatSortModule],
    exports: [PrintFullFeeReceiptListComponent,],
    providers: [ExcelService],
    bootstrap: [FeeComponent],
})
export class FeeModule { }
