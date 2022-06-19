import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ReportCardCbseComponent } from './report-card-cbse.component';
import { PRINT_STUDENT_JUNIOR_REPORT, PRINT_STUDENT_SENIOR_REPORT } from '../../../print/print-routes.constants';
import { PrintStudentJuniorReportListComponent } from './print/print-student-junior-report-list/print-student-junior-report-list.component';
import { PrintStudentSeniorReportListComponent } from './print/print-student-senior-report-list/print-student-senior-report-list.component';

const routes: Routes = [
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
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportCardCbseRoutingModule {}
