import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SalaryComponent } from './salary.component';
import { PRINT_SALARY_SHEET } from '../../print/print-routes.constants';
import { PrintSalarySheetListComponent } from './print/print-salary-sheet-list/print-salary-sheet-list.component';

const routes: Routes = [
    {
        path: 'generate_payslip',
        loadChildren: 'app/modules/salary/pages/generate_payslip/generate_payslip.module#GeneratePayslipModule',
        data: {moduleName: 'salary'},
    },
    {
        path: 'record_payment',
        loadChildren: 'app/modules/salary/pages/record_payment/record_payment.module#RecordPaymentModule',
        data: {moduleName: 'salary'},
    },
    {
        path: 'print_salary_sheet',
        loadChildren: 'app/modules/salary/pages/print_salary_sheet/print_salary_sheet.module#PrintSalarySheetModule',
        data: {moduleName: 'salary'},
    },
    {
        path: 'view_record',
        loadChildren: 'app/modules/salary/pages/view_record/view_record.module#ViewRecordModule',
        data: {moduleName: 'salary'},
    },

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
