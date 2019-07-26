import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { RecordEmployeeAttendanceComponent } from './record-employee-attendance.component';

const routes: Routes = [
    {
        path: '',
        component: RecordEmployeeAttendanceComponent ,
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
export class RecordEmployeeAttendanceRoutingModule { }
