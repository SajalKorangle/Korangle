import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FeeComponent } from './fee.component';
import { PRINT_OLD_FEE_RECIEPT_LIST } from '../../print/print-routes.constants';
import { PrintOldFeeReceiptListComponent } from './print/print-old-fee-receipt-list/print-old-fee-receipt-list.component';

const routes: Routes = [
    {
        path: '',
        component: FeeComponent,
    },
    {
        path: PRINT_OLD_FEE_RECIEPT_LIST,
        component: PrintOldFeeReceiptListComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule,
    ],
})
export class FeeRoutingModule { }
