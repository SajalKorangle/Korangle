import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// import {CustomReportCardComponent} from './custom_reportcard.component';

const routes: Routes = [
    {
        path: 'manage_layout',
        loadChildren: 'app/modules/report-card/custom_reportcard/pages/manage-layout/manage-layout.module#ManageLayoutModule',
        data: {moduleName: 'custom_reportcard'},
    },
    {
        path: 'student_remarks',
        loadChildren: 'app/modules/report-card/custom_reportcard/pages/student-remarks/student-remarks.module#StudentRemarksModule',
        data: {moduleName: 'custom_reportcard'},
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
export class CustomReportCardRoutingModule { }
