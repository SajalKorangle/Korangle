import { NgModule } from '@angular/core';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComponentsModule } from '../../components/components.module';

import { ExaminationComponent } from './examination.component';

import { ExaminationRoutingModule } from './examination.routing';

import { ExaminationOldService } from '../../services/modules/examination/examination-old.service';
import { ExaminationService } from '../../services/modules/examination/examination.service';

import { PrintStudentMarksheetListComponent } from './print/print-student-marksheet-list/print-student-marksheet-list.component';
import { PrintHallTicketComponent } from './print/print-hall-ticket/print-hall-ticket.component';

import { ExcelService } from '../../excel/excel-service';

@NgModule({
    declarations: [ExaminationComponent, PrintStudentMarksheetListComponent, PrintHallTicketComponent],

    imports: [ComponentsModule, ExaminationRoutingModule, NgxDatatableModule],
    exports: [],
    providers: [ExaminationOldService, ExcelService, ExaminationService],
    bootstrap: [ExaminationComponent],
})
export class ExaminationModule {}
