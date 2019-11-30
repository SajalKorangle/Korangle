import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {ReportCardCbseComponent} from './report-card-cbse.component';
import {PRINT_STUDENT_JUNIOR_REPORT, PRINT_STUDENT_SENIOR_REPORT} from "../../../print/print-routes.constants";
import {PrintStudentJuniorReportListComponent} from "./print/print-student-junior-report-list/print-student-junior-report-list.component";
import {PrintStudentSeniorReportListComponent} from "./print/print-student-senior-report-list/print-student-senior-report-list.component";

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
        path: 'add_student_remarks',
        loadChildren: 'app/modules/report-card/cbse/pages/add-student-remarks/add-student-remarks.module#AddStudentRemarksModule',
        data: {moduleName: 'report_card_cbse'},
    },
    {
        path: 'view_grades_remarks',
        loadChildren: 'app/modules/report-card/cbse/pages/view-grades-remarks/view-grades-remarks.module#ViewGradesRemarksModule',
        data: {moduleName: 'report_card_cbse'},
    },
    {
        path: '',
        component: ReportCardCbseComponent,
    },
    {
        path: PRINT_STUDENT_JUNIOR_REPORT,
        component: PrintStudentJuniorReportListComponent,
    },
    {
        path: PRINT_STUDENT_SENIOR_REPORT,
        component: PrintStudentSeniorReportListComponent,
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
