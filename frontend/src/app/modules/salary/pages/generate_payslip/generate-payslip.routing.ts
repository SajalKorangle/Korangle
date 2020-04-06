import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {GeneratePayslipComponent} from "./generate-payslip.component";

const routes: Routes = [
    {
        path: '',
        component: GeneratePayslipComponent ,
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
export class GeneratePayslipRoutingModule { }
