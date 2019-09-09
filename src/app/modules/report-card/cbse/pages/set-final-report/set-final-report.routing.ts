import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {SetFinalReportComponent} from "./set-final-report.component";

const routes: Routes = [
    {
        path: '',
        component: SetFinalReportComponent ,
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
export class SetFinalReportRoutingModule { }
