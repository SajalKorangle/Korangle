import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ParentComponent } from './parent.component';

const routes: Routes = [
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
        path: 'view_tutorials',
        loadChildren: 'app/modules/parent/pages/view-tutorials/view-tutorials.module#ViewTutorialsModule',
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
