import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { PRINT_CUSTOM_REPORTCARD } from '../../../print/print-routes.constants';
import { PrintCustomReportCardComponent } from './print/print-custom_reportcard/print-custom_reportcard.component';


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
    {
        path: 'set_class_layout',
        loadChildren: 'app/modules/report-card/custom_reportcard/pages/set-class-layout/set-class-layout.module#SetClassLayoutModule',
        data: {moduleName: 'custom_reportcard'},
    },
    {
        path: 'generate_final_report',
        loadChildren: 'app/modules/report-card/custom_reportcard/pages/generate-final-report/generate-final-report.module#GenerateFinalReportModule',
        data: {moduleName: 'custom_reportcard'},
    },
    {
        path: PRINT_CUSTOM_REPORTCARD,
        component: PrintCustomReportCardComponent, 
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
