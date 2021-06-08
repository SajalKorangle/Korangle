import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AttendanceReportComponent } from './attendance-report.component';

const routes: Routes = [
    {
        path: '',
        component: AttendanceReportComponent ,
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
export class AttendanceReportRouting { }
