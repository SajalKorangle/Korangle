import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { JobComponent } from './job.component';

const routes: Routes = [

    // template: '<view-profile *ngIf="user.section.subRoute===\'view_profile\'" [user]="user"></view-profile>' +
    // '<view-attendance *ngIf="user.section.subRoute===\'view_attendance\'" [user]="user"></view-attendance>' +
    // '<view-payment *ngIf="user.section.subRoute===\'view_payment\'" [user]="user"></view-payment>' +
    // '<apply-leave *ngIf="user.section.subRoute===\'apply_leave\'" [user]="user"></apply-leave>',

    {
        path: 'view_profile',
        loadChildren: 'app/modules/job/pages/view-profile/view-profile.module#ViewProfileModule',
        data: {moduleName: 'job'},
    },
    {
        path: 'view_attendance',
        loadChildren: 'app/modules/job/pages/view-attendance/view-attendance.module#ViewAttendanceModule',
        data: {moduleName: 'job'},
    },
    {
        path: 'view_payment',
        loadChildren: 'app/modules/job/pages/view-payment/view-payment.module#ViewPaymentModule',
        data: {moduleName: 'job'},
    },
    {
        path: 'apply_leave',
        loadChildren: 'app/modules/job/pages/apply-leave/apply-leave.module#ApplyLeaveModule',
        data: {moduleName: 'job'},
    },

    {
        path: '',
        component: JobComponent,
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
export class JobRoutingModule { }
