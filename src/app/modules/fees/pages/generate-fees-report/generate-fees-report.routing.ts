import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {GenerateFeesReportComponent} from "./generate-fees-report.component";

const routes: Routes = [
    {
        path: '',
        component: GenerateFeesReportComponent ,
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
export class GenerateFeesReportRoutingModule { }
