import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {CancelDiscountComponent} from "./cancel-discount.component";

const routes: Routes = [
    {
        path: '',
        component: CancelDiscountComponent ,
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
export class CancelDiscountRoutingModule { }
