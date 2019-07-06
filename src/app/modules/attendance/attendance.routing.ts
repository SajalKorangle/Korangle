import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AttendanceComponent } from './attendance.component';
import { PrintEmployeeAttendanceListComponent } from './print/print-employee-attendance-list/print-employee-attendance-list.component';
import { PrintStudentAttendanceListComponent } from './print/print-student-attendance-list/print-student-attendance-list.component';
import { PRINT_EMPLOYEE_ATTENDANCE, PRINT_STUDENT_ATTENDANCE } from 'app/print/print-routes.constants';

const routes: Routes = [
    {
        path: '',
        component: AttendanceComponent,
    },
    {
        path: PRINT_EMPLOYEE_ATTENDANCE,
        component: PrintEmployeeAttendanceListComponent,
    },
    {
        path: PRINT_STUDENT_ATTENDANCE,
        component: PrintStudentAttendanceListComponent,
    },
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
export class AttendanceRoutingModule { }
