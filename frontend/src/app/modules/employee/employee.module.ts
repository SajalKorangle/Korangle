import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { EmployeeComponent } from './employee.component';

import { AddEmployeeComponent } from './pages/add-employee/add-employee.component';
import { ViewAllComponent } from './pages/view-all/view-all.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { AssignTaskComponent } from './pages/assign-task/assign-task.component';

import { EmployeeRoutingModule } from './employee.routing';

import { EmployeeOldService } from '../../services/modules/employee/employee-old.service';
import { ICardsComponent } from './pages/i-cards/i-cards.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ExperienceCertiComponent } from './pages/experience-certi/experience-certi.component';
import { PrintEmployeeExpCertiComponent } from './print/print-employee-exp-certi/print-employee-exp-certi.component';
import { PrintEmployeeICardsComponent } from './print/print-employee-i-card/print-employee-i-cards.component';
import { PrintEmployeeListComponent } from './print/print-employee-list/print-employee-list.component';
import { ExcelService } from "../../excel/excel-service";
import { ImagePdfPreviewDialogComponent } from 'app/components/image-pdf-preview-dialog/image-pdf-preview-dialog.component';

@NgModule({
    declarations: [
        EmployeeComponent,
        // AddEmployeeComponent,
        // ViewAllComponent,
        // UpdateProfileComponent,
        // AssignTaskComponent,
        // ICardsComponent,
        // ExperienceCertiComponent,
        PrintEmployeeExpCertiComponent,
        PrintEmployeeICardsComponent,
        PrintEmployeeListComponent,
    ],

    imports: [
        ComponentsModule,
        EmployeeRoutingModule,
        NgxDatatableModule

    ],
    exports: [
        ImagePdfPreviewDialogComponent,
    ],
    entryComponents: [
        ImagePdfPreviewDialogComponent,
    ],
    providers: [EmployeeOldService, ExcelService],
    bootstrap: [EmployeeComponent],
})
export class EmployeeModule { }
