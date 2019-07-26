import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {GiveDiscountComponent} from "./give-discount.component";

const routes: Routes = [
    {
        path: '',
        component: GiveDiscountComponent ,
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
export class GiveDiscountRoutingModule { }
