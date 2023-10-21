import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { PayBillComponent } from './pay-bill.component';

const routes: Routes = [
    {
        path: '',
        component: PayBillComponent ,
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
export class PayBillRoutingModule { }
