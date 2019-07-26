import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {AddFeeTypeComponent} from "./add-fee-type.component";

const routes: Routes = [
    {
        path: '',
        component: AddFeeTypeComponent ,
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
export class AddFeeTypeRoutingModule { }
