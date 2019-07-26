import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {CollectFeeComponent} from "./collect-fee.component";

const routes: Routes = [
    {
        path: '',
        component: CollectFeeComponent ,
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
export class CollectFeeRoutingModule { }
