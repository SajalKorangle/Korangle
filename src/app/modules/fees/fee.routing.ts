import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FeeComponent } from './fee.component';
import { PRINT_OLD_FEE_RECIEPT_LIST, PRINT_FEE_RECIEPT_LIST } from '../../print/print-routes.constants';
import { PrintOldFeeReceiptListComponent } from '../fees-second/print/print-old-fee-receipt-list/print-old-fee-receipt-list.component';
import { PrintFeeReceiptListComponent } from './print/print-fee-receipt-list/print-fee-receipt-list.component';

const routes: Routes = [
    {
        path: '',
        component: FeeComponent,
    },
    {
        path: PRINT_OLD_FEE_RECIEPT_LIST,
        component: PrintOldFeeReceiptListComponent,
    },
    {
        path: PRINT_FEE_RECIEPT_LIST,
        component: PrintFeeReceiptListComponent,
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
