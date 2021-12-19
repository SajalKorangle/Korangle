import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { BillComponent } from './bill.component';

const routes: Routes = [
    {
        path: 'pay_bill',
        loadChildren: 'app/modules/bill/pages/pay-bill/pay-bill.module#PayBillModule',
        data: {moduleName: 'Bill'},
    },
    {
        path: 'view_history',
        loadChildren: 'app/modules/bill/pages/view-history/view-history.module#ViewHistoryModule',
        data: {moduleName: 'Bill'},
    },
    {
        path: '',
        component: BillComponent,
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
export class BillRoutingModule { }
