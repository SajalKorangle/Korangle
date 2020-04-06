import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {RecordPaymentComponent} from "./record-payment.component";

const routes: Routes = [
    {
        path: '',
        component: RecordPaymentComponent ,
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
export class RecordPaymentRoutingModule { }
