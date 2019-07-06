import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SalaryComponent } from './salary.component';
import { PRINT_SALARY_SHEET } from '../../print/print-routes.constants';
import { PrintSalarySheetListComponent } from './print/print-salary-sheet-list/print-salary-sheet-list.component';

const routes: Routes = [
    {
        path: '',
        component: SalaryComponent,
    },
    {
        path: PRINT_SALARY_SHEET,
        component: PrintSalarySheetListComponent,
    },
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
export class SalaryRoutingModule { }
