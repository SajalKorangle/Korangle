import { NgModule } from '@angular/core';

import { MatExpansionModule } from '@angular/material';
import { MatSortModule } from '@angular/material';

import { ComponentsModule } from '@components/components.module';

import { PrintFeeReceiptListComponent } from './print-fee-receipt-list/print-fee-receipt-list.component';
import { PrintFullFeeReceiptListComponent } from './print-full-fee-receipt-list/print-full-fee-receipt-list.component';
import { PrintFeesCertificateComponent } from './print-fees-certificate/print-fees-certificate.component';
import { PrintFeesReportComponent } from './print-fees-report/print-fees-report.component';

import { FeesComponentsModule } from './../components/fees-components.module';

@NgModule({
    declarations: [
        PrintFeeReceiptListComponent,
        PrintFullFeeReceiptListComponent,
        PrintFeesCertificateComponent,
        PrintFeesReportComponent,
    ],

    imports: [ComponentsModule, MatExpansionModule, MatSortModule, FeesComponentsModule],
    exports: [
        PrintFeeReceiptListComponent,
        PrintFullFeeReceiptListComponent,
        PrintFeesCertificateComponent,
        PrintFeesReportComponent,
    ],
})
export class FeePrintModule { }
