import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {ReportCardCbseComponent} from './report-card-cbse.component';

const routes: Routes = [
    {
        path: 'grade_student_fields',
        loadChildren: 'app/modules/report-card/cbse/pages/grade-student-fields/grade-student-fields.module#GradeStudentFieldsModule',
        data: {moduleName: 'report_card_cbse'},
    },
    {
        path: 'set_final_report',
        loadChildren: 'app/modules/report-card/cbse/pages/set-final-report/set-final-report.module#SetFinalReportModule',
        data: {moduleName: 'report_card_cbse'},
    },
    {
        path: 'generate_final_report',
        loadChildren: 'app/modules/report-card/cbse/pages/generate-final-report/generate-final-report.module#GenerateFinalReportModule',
        data: {moduleName: 'report_card_cbse'},
    },
    {
        path: '',
        component: ReportCardCbseComponent,
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
export class ReportCardCbseRoutingModule { }
