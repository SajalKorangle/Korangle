import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ViewFeeComponent } from "./view-fee.component";

const routes: Routes = [
    {
        path: '',
        component: ViewFeeComponent ,
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
export class ViewFeeRoutingModule { }
