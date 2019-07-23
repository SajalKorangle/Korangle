import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AttendanceComponent } from './attendance.component';
import { PrintEmployeeAttendanceListComponent } from './print/print-employee-attendance-list/print-employee-attendance-list.component';
import { PrintStudentAttendanceListComponent } from './print/print-student-attendance-list/print-student-attendance-list.component';
import { PRINT_EMPLOYEE_ATTENDANCE, PRINT_STUDENT_ATTENDANCE } from 'app/print/print-routes.constants';

const routes: Routes = [
    // '<record-attendance *ngIf="user.section.subRoute===\'record_student_attendance\'" [user]="user"></record-attendance>' +
    // '<record-employee-attendance *ngIf="user.section.subRoute===\'record_employee_attendance\'" [user]="user"></record-employee-attendance>' +
    // '<declare-holidays *ngIf="user.section.subRoute===\'declare_holidays\'" [user]="user"></declare-holidays>' +
    // '<approve-leave *ngIf="user.section.subRoute===\'approve_leave\'" [user]="user"></approve-leave>' +
    // '<give-permissions *ngIf="user.section.subRoute===\'give_permissions\'" [user]="user"></give-permissions>',

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
        path: 'give_permissions',
        loadChildren: 'app/modules/attendance/pages/give-permissions/give-permissions.module#GivePermissionModule',
        data: {moduleName: 'attendance'},
    },
    {
        path: 'approve_leave',
        loadChildren: 'app/modules/attendance/pages/approve-leave/approve-leave.module#ApproveLeaveModule',
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
