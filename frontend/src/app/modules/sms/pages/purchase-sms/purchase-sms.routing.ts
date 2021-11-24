import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { PurchaseSmsComponent } from './purchase-sms.component';

const routes: Routes = [
    {
        path: '',
        component: PurchaseSmsComponent ,
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
export class PurchaseSmsRoutingModule { }
