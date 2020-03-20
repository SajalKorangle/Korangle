import { NgModule } from '@angular/core';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComponentsModule } from '../../../components/components.module';

import { ReportCardCbseComponent } from './report-card-cbse.component';

import { ReportCardCbseRoutingModule } from './report-card-cbse.routing';

import { ExaminationOldService } from '../../../services/modules/examination/examination-old.service';
import { ExaminationService } from '../../../services/modules/examination/examination.service';
import { PrintStudentJuniorReportListComponent } from "./print/print-student-junior-report-list/print-student-junior-report-list.component";

import { ExcelService } from "../../../excel/excel-service";
import {PrintStudentSeniorReportListComponent} from "./print/print-student-senior-report-list/print-student-senior-report-list.component";

@NgModule({
    declarations: [

        ReportCardCbseComponent,
        PrintStudentJuniorReportListComponent,
        PrintStudentSeniorReportListComponent,

    ],

    imports: [
        ComponentsModule,
        ReportCardCbseRoutingModule,
        NgxDatatableModule,
    ],
    exports: [],
    providers: [ExaminationOldService,ExaminationService, ExcelService],
    bootstrap: [ReportCardCbseComponent],
})
export class ReportCardCbseModule { }
