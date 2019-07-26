import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {TotalDiscountComponent} from "./total-discount.component";

const routes: Routes = [
    {
        path: '',
        component: TotalDiscountComponent ,
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
export class TotalDiscountRoutingModule { }
