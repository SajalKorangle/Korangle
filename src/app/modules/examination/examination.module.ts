import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { ExaminationComponent } from './examination.component';

import { CreateExaminationComponent} from './pages/create-examination/create-examination.component';
import { CreateTestComponent } from './pages/create-test/create-test.component';
import { GenerateHallTicketComponent } from './pages/generate-hall-ticket/generate-hall-ticket.component';

import { ExaminationRoutingModule } from './examination.routing';

import { ExaminationService } from '../../services/examination.service';
import {UpdateMarksComponent} from './pages/update-marks/update-marks.component';
import {PrintMarksheetComponent} from './pages/print-marksheet/print-marksheet.component';
import {GradeStudentFieldsComponent} from './pages/grade-student-fields/grade-student-fields.component';
import {SetFinalReportComponent} from './pages/set-final-report/set-final-report.component';

@NgModule({
    declarations: [

        ExaminationComponent,

        CreateExaminationComponent,
        CreateTestComponent,
        GenerateHallTicketComponent,
        UpdateMarksComponent,
        PrintMarksheetComponent,
        GradeStudentFieldsComponent,
        SetFinalReportComponent,

    ],

    imports: [

        ComponentsModule,
        ExaminationRoutingModule,

    ],
    exports: [
    ],
    providers: [ExaminationService],
    bootstrap: [ExaminationComponent],
})
export class ExaminationModule { }
