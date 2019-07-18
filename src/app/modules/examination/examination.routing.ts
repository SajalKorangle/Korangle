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
import {PrintStudentEleventhFinalReportListComponent} from "./print/print-student-eleventh-final-report-list/print-student-eleventh-final-report-list.component";

const routes: Routes = [
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
