import { NgModule } from '@angular/core';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComponentsModule } from '../../../components/components.module';

import { ReportCardMpBoardComponent } from './report-card-mp-board.component';

import { ReportCardMpBoardRoutingModule } from './report-card-mp-board.routing';

import { ExaminationOldService } from '../../../services/modules/examination/examination-old.service';
import { ExaminationService } from '../../../services/modules/examination/examination.service';
import { PrintStudentNinthFinalReportListComponent } from './print/print-student-ninth-final-report-list/print-student-ninth-final-report-list.component';
import { PrintStudentNinthFinalReportList2019Component } from './print/print-student-ninth-final-report-list-2019/print-student-ninth-final-report-list-2019.component';
import { PrintStudentEleventhFinalReportListComponent } from './print/print-student-eleventh-final-report-list/print-student-eleventh-final-report-list.component';
import { PrintStudentComprehensiveFinalReportListComponent } from './print/print-student-comprehensive-final-report-list/print-student-comprehensive-final-report-list.component';
import { PrintStudentElegantFinalReportListComponent } from './print/print-student-elegant-final-report-list/print-student-elegant-final-report-list.component';
import { PrintStudentClassicFinalReportListComponent } from './print/print-student-classic-final-report-list/print-student-classic-final-report-list.component';
import { ExcelService } from '../../../excel/excel-service';

@NgModule({
    declarations: [
        ReportCardMpBoardComponent,

        PrintStudentNinthFinalReportListComponent,
        PrintStudentNinthFinalReportList2019Component,
        PrintStudentEleventhFinalReportListComponent,
        PrintStudentComprehensiveFinalReportListComponent,
        PrintStudentElegantFinalReportListComponent,
        PrintStudentClassicFinalReportListComponent,
    ],

    imports: [ComponentsModule, ReportCardMpBoardRoutingModule, NgxDatatableModule],
    exports: [],
    providers: [ExaminationOldService, ExaminationService, ExcelService],
    bootstrap: [ReportCardMpBoardComponent],
})
export class ReportCardMpBoardModule {}
