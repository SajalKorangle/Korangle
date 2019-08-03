import { NgModule } from '@angular/core';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComponentsModule } from '../../components/components.module';

import { StudentComponent } from './student.component';

import {StudentRoutingModule} from './student.routing';
import { PrintICardsComponent } from './print/print-i-card/print-i-cards.component';
import {PrintMultipleICardsComponent} from "./print/print-multiple-i-cards/print-multiple-i-cards.component";
import { PrintTransferCertificateSecondFormatComponent } from './print/print-transfer-certificate-second-format/print-transfer-certificate-second-format.component';
import { PrintStudentListComponent } from './print/print-student-list/print-student-list.component';
import {ExcelService} from "../../excel/excel-service";

@NgModule({
    declarations: [

        StudentComponent,

        PrintICardsComponent,
        PrintMultipleICardsComponent,
        PrintTransferCertificateSecondFormatComponent,
        PrintStudentListComponent,

    ],

    imports: [
        ComponentsModule,
        StudentRoutingModule,
        NgxDatatableModule,

    ],
    exports: [
    ],
    providers: [ExcelService],
    bootstrap: [StudentComponent]
})
export class StudentModule { }
