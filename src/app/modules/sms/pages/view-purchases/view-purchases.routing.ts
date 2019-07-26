import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {ViewPurchasesComponent} from "./view-purchases.component";

const routes: Routes = [
    {
        path: '',
        component: ViewPurchasesComponent ,
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
export class ViewPurchasesRoutingModule { }
