import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {OnlinePaymentAccountComponent} from "./online-payment-account.component";

const routes: Routes = [
    {
        path: '',
        component: OnlinePaymentAccountComponent ,
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
export class OnlinePaymentAccountRoutingModule { }
