import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MarksheetComponent } from './marksheet.component';
import { PRINT_MARKSHEET, PRINT_MARKSHEET_SECOND_FORMAT } from '../../print/print-routes.constants';
import { PrintMarksheetComponent } from './print/print-marksheet/print-marksheet.component';
import { PrintMarksheetSecondFormatComponent } from './print/print-marksheet-second-format/print-marksheet-second-format.component';

const routes: Routes = [
    {
        path: 'update_marks',
        loadChildren: 'app/modules/marksheet/pages/update-marks/update-marks.module#UpdateMarksModule',
        data: {moduleName: 'marksheet'},
    },
    {
        path: 'print_marksheet',
        loadChildren: 'app/modules/marksheet/pages/view-marksheet/view-marksheet.module#ViewMarksheetModule',
        data: {moduleName: 'marksheet'},
    },

    {
        path: '',
        component: MarksheetComponent,
    },
    {
        path: PRINT_MARKSHEET,
        component: PrintMarksheetComponent
    },
    {
        path: PRINT_MARKSHEET_SECOND_FORMAT,
        component: PrintMarksheetSecondFormatComponent,
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule,
    ],
})
export class MarksheetRoutingModule { }
