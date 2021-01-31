import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AttendanceComponent } from './attendance.component';
import { PrintEmployeeAttendanceListComponent } from './print/print-employee-attendance-list/print-employee-attendance-list.component';
import { PrintStudentAttendanceListComponent } from './print/print-student-attendance-list/print-student-attendance-list.component';
import { PRINT_EMPLOYEE_ATTENDANCE, PRINT_STUDENT_ATTENDANCE } from '../../print/print-routes.constants';

const routes: Routes = [
    {
        path: 'record_student_attendance',
        loadChildren: 'app/modules/attendance/pages/record-attendance/record-attendance.module#RecordAttendanceModule',
        data: {moduleName: 'attendance'},
    },
    {
        path: 'declare_holidays',
        loadChildren: 'app/modules/attendance/pages/declare-holidays/declare-holidays.module#DeclareHolidaysModule',
        data: {moduleName: 'attendance'},
    },
    {
        path: 'record_employee_attendance',
        loadChildren: 'app/modules/attendance/pages/record-employee-attendance/record-employee-attendance.module#RecordEmployeeAttendanceModule',
        data: {moduleName: 'attendance'},
    },
    {
        path: 'approve_leave',
        loadChildren: 'app/modules/attendance/pages/approve-leave/approve-leave.module#ApproveLeaveModule',
        data: {moduleName: 'attendance'},
    },
    {
        path: 'settings',
        loadChildren: 'app/modules/attendance/pages/settings/settings.module#SettingsModule',
        data: {moduleName: 'attendance'},
    },
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
