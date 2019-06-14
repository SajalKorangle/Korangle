import { NgModule } from '@angular/core';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComponentsModule } from '../../components/components.module';

import { ExaminationComponent } from './examination.component';

import { CreateExaminationComponent} from './pages/create-examination/create-examination.component';
import { CreateTestComponent } from './pages/create-test/create-test.component';
import { GenerateHallTicketComponent } from './pages/generate-hall-ticket/generate-hall-ticket.component';

import { ExaminationRoutingModule } from './examination.routing';

import { ExaminationOldService } from '../../services/examination-old.service';
import {UpdateMarksComponent} from './pages/update-marks/update-marks.component';
import {UpdateCceMarksComponent} from './pages/update-cce-marks/update-cce-marks.component';
import {PrintMarksheetComponent} from './pages/print-marksheet/print-marksheet.component';
import {GradeStudentFieldsComponent} from './pages/grade-student-fields/grade-student-fields.component';
import {SetFinalReportComponent} from './pages/set-final-report/set-final-report.component';
import {GenerateFinalReportComponent} from './pages/generate-final-report/generate-final-report.component';
import {GeneratePatrakComponent} from './pages/generate-patrak/generate-patrak.component';
import {GenerateGoshwaraComponent} from './pages/generate-goshwara/generate-goshwara.component';
import { PrintStudentNinthFinalReportListComponent } from './print/print-student-ninth-final-report-list/print-student-ninth-final-report-list.component';
import { PrintStudentEleventhFinalReportListComponent } from './print/print-student-eleventh-final-report-list/print-student-eleventh-final-report-list.component';
import { PrintStudentComprehensiveFinalReportListComponent } from './print/print-student-comprehensive-final-report-list/print-student-comprehensive-final-report-list.component';
import { PrintStudentElegantFinalReportListComponent } from './print/print-student-elegant-final-report-list/print-student-elegant-final-report-list.component';
import { PrintStudentClassicFinalReportListComponent } from './print/print-student-classic-final-report-list/print-student-classic-final-report-list.component';

@NgModule({
    declarations: [

        ExaminationComponent,

        CreateExaminationComponent,
        CreateTestComponent,
        GenerateHallTicketComponent,
        UpdateMarksComponent,
        UpdateCceMarksComponent,
        PrintMarksheetComponent,
        GradeStudentFieldsComponent,
        SetFinalReportComponent,
        GenerateFinalReportComponent,
        GeneratePatrakComponent,
        GenerateGoshwaraComponent,
        PrintStudentNinthFinalReportListComponent,
        PrintStudentEleventhFinalReportListComponent,
        PrintStudentComprehensiveFinalReportListComponent,
        PrintStudentElegantFinalReportListComponent,
        PrintStudentClassicFinalReportListComponent

    ],

    imports: [

        ComponentsModule,
        ExaminationRoutingModule,
        NgxDatatableModule,

    ],
    exports: [
    ],
    providers: [ExaminationOldService],
    bootstrap: [ExaminationComponent],
})
export class ExaminationModule { }
