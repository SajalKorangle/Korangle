import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ViewReportComponent } from './view-report.component';

const routes: Routes = [
    {
        path: '',
        component: ViewReportComponent ,
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
export class ViewReportRoutingModule { }
