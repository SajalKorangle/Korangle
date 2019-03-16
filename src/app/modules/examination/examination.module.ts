import { NgModule } from '@angular/core';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComponentsModule } from '../../components/components.module';

import { ExaminationComponent } from './examination.component';

import { CreateExaminationComponent} from './pages/create-examination/create-examination.component';
import { CreateTestComponent } from './pages/create-test/create-test.component';
import { GenerateHallTicketComponent } from './pages/generate-hall-ticket/generate-hall-ticket.component';

import { ExaminationRoutingModule } from './examination.routing';

import { ExaminationService } from '../../services/examination.service';
import {UpdateMarksComponent} from './pages/update-marks/update-marks.component';
import {UpdateCceMarksComponent} from './pages/update-cce-marks/update-cce-marks.component';
import {PrintMarksheetComponent} from './pages/print-marksheet/print-marksheet.component';
import {GradeStudentFieldsComponent} from './pages/grade-student-fields/grade-student-fields.component';
import {SetFinalReportComponent} from './pages/set-final-report/set-final-report.component';
import {GenerateFinalReportComponent} from './pages/generate-final-report/generate-final-report.component';
import {GeneratePatrakComponent} from './pages/generate-patrak/generate-patrak.component';
import {GenerateGoshwaraComponent} from './pages/generate-goshwara/generate-goshwara.component';

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

    ],

    imports: [

        ComponentsModule,
        ExaminationRoutingModule,
        NgxDatatableModule,

    ],
    exports: [
    ],
    providers: [ExaminationService],
    bootstrap: [ExaminationComponent],
})
export class ExaminationModule { }
