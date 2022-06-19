import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ReportCardMpBoardComponent } from './report-card-mp-board.component';
import {
    PRINT_STUDENT_NINTH_FINAL_REPORT,
    PRINT_STUDENT_ELEVENTH_FINAL_REPORT,
    PRINT_STUDENT_COMPREHENSIVE_FINAL_REPORT,
    PRINT_STUDENT_ELEGANT_FINAL_REPORT,
    PRINT_STUDENT_CLASSIC_FINAL_REPORT,
    PRINT_STUDENT_NINTH_FINAL_REPORT_2019,
} from '../../../print/print-routes.constants';

import { PrintStudentNinthFinalReportListComponent } from './print/print-student-ninth-final-report-list/print-student-ninth-final-report-list.component';
import { PrintStudentNinthFinalReportList2019Component } from './print/print-student-ninth-final-report-list-2019/print-student-ninth-final-report-list-2019.component';
import { PrintStudentClassicFinalReportListComponent } from './print/print-student-classic-final-report-list/print-student-classic-final-report-list.component';
import { PrintStudentComprehensiveFinalReportListComponent } from './print/print-student-comprehensive-final-report-list/print-student-comprehensive-final-report-list.component';
import { PrintStudentElegantFinalReportListComponent } from './print/print-student-elegant-final-report-list/print-student-elegant-final-report-list.component';
import { PrintStudentEleventhFinalReportListComponent } from './print/print-student-eleventh-final-report-list/print-student-eleventh-final-report-list.component';

const routes: Routes = [
    {
        path: '',
        component: ReportCardMpBoardComponent,
    },
    {
        path: PRINT_STUDENT_NINTH_FINAL_REPORT,
        component: PrintStudentNinthFinalReportListComponent,
    },
    {
        path: PRINT_STUDENT_NINTH_FINAL_REPORT_2019,
        component: PrintStudentNinthFinalReportList2019Component,
    },
    {
        path: PRINT_STUDENT_ELEVENTH_FINAL_REPORT,
        component: PrintStudentEleventhFinalReportListComponent,
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
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportCardMpBoardRoutingModule {}
