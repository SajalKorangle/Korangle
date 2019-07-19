import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ExaminationComponent } from './examination.component';
import { PRINT_STUDENT_NINTH_FINAL_REPORT, PRINT_STUDENT_ELEVENTH_FINAL_REPORT, PRINT_STUDENT_COMPREHENSIVE_FINAL_REPORT, PRINT_STUDENT_ELEGANT_FINAL_REPORT, PRINT_STUDENT_CLASSIC_FINAL_REPORT, PRINT_HALL_TICKET, PRINT_STUDENT_MARKSHEET } from '../../print/print-routes.constants';

import { PrintStudentNinthFinalReportListComponent } from './print/print-student-ninth-final-report-list/print-student-ninth-final-report-list.component';
import { PrintStudentClassicFinalReportListComponent } from './print/print-student-classic-final-report-list/print-student-classic-final-report-list.component';
import { PrintStudentComprehensiveFinalReportListComponent } from './print/print-student-comprehensive-final-report-list/print-student-comprehensive-final-report-list.component';
import { PrintStudentElegantFinalReportListComponent } from './print/print-student-elegant-final-report-list/print-student-elegant-final-report-list.component';
import { PrintHallTicketComponent } from './print/print-hall-ticket/print-hall-ticket.component';
import { PrintStudentMarksheetListComponent } from './print/print-student-marksheet-list/print-student-marksheet-list.component';

const routes: Routes = [
    {
        path: 'create_examination',
        loadChildren: 'app/modules/examination/pages/create-examination/create-examination.module#CreateExaminationModule',
        data: {moduleName: 'examination'},
    },
    {
        path: 'create_test',
        loadChildren: 'app/modules/examination/pages/create-test/create-test.module#CreateTestModule',
        data: {moduleName: 'examination'},
    },
    {
        path: 'generate_hall_ticket',
        loadChildren: 'app/modules/examination/pages/generate-hall-ticket/generate-hall-ticket.module#GenerateHallTicketModule',
        data: {moduleName: 'examination'},
    },
    {
        path: 'update_marks',
        loadChildren: 'app/modules/examination/pages/update-marks/update-marks.module#UpdateMarksModule',
        data: {moduleName: 'examination'},
    },
    {
        path: 'update_cce_marks',
        loadChildren: 'app/modules/examination/pages/update-cce-marks/update-cce-marks.module#UpdateCceMarksModule',
        data: {moduleName: 'examination'},
    },
    {
        path: 'print_marksheet',
        loadChildren: 'app/modules/examination/pages/print-marksheet/print-marksheet.module#PrintMarksheetModule',
        data: {moduleName: 'examination'},
    },
    {
        path: 'grade_student_fields',
        loadChildren: 'app/modules/examination/pages/grade-student-fields/grade-student-fields.module#GradeStudentFieldsModule',
        data: {moduleName: 'examination'},
    },
    {
        path: 'set_final_report',
        loadChildren: 'app/modules/examination/pages/set-final-report/set-final-report.module#SetFinalReportModule',
        data: {moduleName: 'examination'},
    },
    {
        path: 'generate_final_report',
        loadChildren: 'app/modules/examination/pages/generate-final-report/generate-final-report.module#CreateExaminationModule',
        data: {moduleName: 'examination'},
    },
    {
        path: 'create_examination',
        loadChildren: 'app/modules/examination/pages/create-examination/create-examination.module#CreateExaminationModule',
        data: {moduleName: 'examination'},
    },
    {
        path: 'generate_patrak',
        loadChildren: 'app/modules/examination/pages/generate-patrak/generate-patrak.module#GeneratePatrakModule',
        data: {moduleName: 'examination'},
    },
    {
        path: 'generate_goshwara',
        loadChildren: 'app/modules/examination/pages/generate-goshwara/generate-goshwara.module#GenerateGoshwaraModule',
        data: {moduleName: 'examination'},
    },
    {
        path: '',
        component: ExaminationComponent,
    },
    {
        path: PRINT_STUDENT_NINTH_FINAL_REPORT,
        component: PrintStudentNinthFinalReportListComponent,
    },
    {
        path: PRINT_STUDENT_ELEVENTH_FINAL_REPORT,
        component: PrintStudentClassicFinalReportListComponent,
    },
    {
        path: PRINT_STUDENT_COMPREHENSIVE_FINAL_REPORT,
        component: PrintStudentComprehensiveFinalReportListComponent,
    },
    {
        path: PRINT_STUDENT_ELEGANT_FINAL_REPORT,
        component: PrintStudentElegantFinalReportListComponent,
    },
    {
        path: PRINT_STUDENT_CLASSIC_FINAL_REPORT,
        component: PrintStudentClassicFinalReportListComponent,
    },
    {
        path: PRINT_HALL_TICKET,
        component: PrintHallTicketComponent,
    },
    {
        path: PRINT_STUDENT_MARKSHEET,
        component: PrintStudentMarksheetListComponent,
    }

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
export class ExaminationRoutingModule { }
