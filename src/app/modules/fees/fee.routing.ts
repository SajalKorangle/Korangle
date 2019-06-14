import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FeeComponent } from './fee.component';
import {  PRINT_FEE_RECIEPT_LIST } from '../../print/print-routes.constants';
import { PrintFeeReceiptListComponent } from './print/print-fee-receipt-list/print-fee-receipt-list.component';

const routes: Routes = [
    {
        path: '',
        component: FeeComponent,
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
