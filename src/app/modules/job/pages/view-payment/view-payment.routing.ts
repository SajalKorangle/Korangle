import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {ViewPaymentComponent} from "./view-payment.component";

const routes: Routes = [
    {
        path: '',
        component: ViewPaymentComponent ,
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
export class ViewPaymentRoutingModule { }
