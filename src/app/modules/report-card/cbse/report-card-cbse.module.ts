import { NgModule } from '@angular/core';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComponentsModule } from '../../../components/components.module';

import { ReportCardCbseComponent } from './report-card-cbse.component';

import { ReportCardCbseRoutingModule } from './report-card-cbse.routing';

import { ExaminationOldService } from '../../../services/modules/examination/examination-old.service';

import { ExcelService } from "../../../excel/excel-service";

@NgModule({
    declarations: [

        ReportCardCbseComponent,

    ],

    imports: [
        ComponentsModule,
        ReportCardCbseRoutingModule,
        NgxDatatableModule,
    ],
    exports: [],
    providers: [ExaminationOldService, ExcelService],
    bootstrap: [ReportCardCbseComponent],
})
export class ReportCardCbseModule { }
