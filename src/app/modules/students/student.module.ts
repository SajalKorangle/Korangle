import { NgModule } from '@angular/core';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComponentsModule } from '../../components/components.module';

import { StudentComponent } from './student.component';

import { AddStudentComponent } from "./pages/add-student/add-student.component";
import { ChangeClassComponent } from './pages/change-class/change-class.component';
import { GenerateTcComponent } from './pages/generate-tc/generate-tc.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { ViewAllComponent } from './pages/view-all/view-all.component';
import { UploadListComponent } from './pages/upload_list/upload-list.component';
import { ICardsComponent } from './pages/i-cards/i-cards.component';

import {StudentRoutingModule} from './student.routing';
import {UpdateAllComponent} from './pages/update_all/update-all.component';
import {PromoteStudentComponent} from "./pages/promote-student/promote-student.component";
import { PrintICardsComponent } from './print/print-i-card/print-i-cards.component';
import {PrintMultipleICardsComponent} from "./print/print-multiple-i-cards/print-multiple-i-cards.component";
import { PrintTransferCertificateSecondFormatComponent } from './print/print-transfer-certificate-second-format/print-transfer-certificate-second-format.component';
import { PrintStudentListComponent } from './print/print-student-list/print-student-list.component';
import {ExcelService} from "../../excel/excel-service";

@NgModule({
    declarations: [

        StudentComponent,
        // AddStudentComponent,
        // ChangeClassComponent,
        // GenerateTcComponent,
        // PromoteStudentComponent,
        // UpdateProfileComponent,
        // ViewAllComponent,
        // UpdateAllComponent,
        // UploadListComponent,
        // ICardsComponent,

        PrintICardsComponent,
        PrintMultipleICardsComponent,
        PrintTransferCertificateSecondFormatComponent,
        PrintStudentListComponent

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
