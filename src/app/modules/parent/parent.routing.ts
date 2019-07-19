import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ParentComponent } from './parent.component';

const routes: Routes = [

//
//     template: '<view-profile *ngIf="user.section.subRoute===\'view_profile\'" [user]="user" [studentId]="user.section.student.id"></view-profile>' +
// '<view-fee *ngIf="user.section.subRoute===\'view_fee\'" [user]="user"></view-fee>' +
// '<view-marks *ngIf="user.section.subRoute===\'view_marks\'" [user]="user" [studentId]="user.section.student.id"></view-marks>' +
// '<view-attendance *ngIf="user.section.subRoute===\'view_attendance\'" [user]="user" [studentId]="user.section.student.id"></view-attendance>',


    {
        path: 'view_profile',
        loadChildren: 'app/modules/parent/pages/view-profile/view-profile.module#ViewProfileModule',
        data: {moduleName: 'parent'},
    },
    {
        path: 'view_fee',
        loadChildren: 'app/modules/parent/pages/view-fee/view-fee.module#ViewFeeModule',
        data: {moduleName: 'parent'},
    },
    {
        path: 'view_marks',
        loadChildren: 'app/modules/parent/pages/view-marks/view-marks.module#ViewMarksModule',
        data: {moduleName: 'parent'},
    },
    {
        path: 'view_attendance',
        loadChildren: 'app/modules/parent/pages/view-attendance/view-attendance.module#ViewAttendanceModule',
        data: {moduleName: 'parent'},
    },

    {
        path: '',
        component: ParentComponent,
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
export class ParentRoutingModule { }
