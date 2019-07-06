import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FeeComponent } from './fee.component';
import {  PRINT_FEE_RECIEPT_LIST, PRINT_FULL_FEE_RECIEPT_LIST } from '../../print/print-routes.constants';
import { PrintFeeReceiptListComponent } from './print/print-fee-receipt-list/print-fee-receipt-list.component';
import { PrintFullFeeReceiptListComponent } from './print/print-full-fee-receipt-list/print-full-fee-receipt-list.component';

const routes: Routes = [
    {
        path: '',
        component: FeeComponent,
    },
    {
        path: PRINT_FEE_RECIEPT_LIST,
        component: PrintFeeReceiptListComponent,
    },
    {
        path: PRINT_FULL_FEE_RECIEPT_LIST,
        component: PrintFullFeeReceiptListComponent,
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
