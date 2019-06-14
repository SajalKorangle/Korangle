import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeComponent } from './employee.component';
import { PrintEmployeeExpCertiComponent } from './print/print-employee-exp-certi/print-employee-exp-certi.component';
import { PrintEmployeeICardsComponent } from './print/print-employee-i-card/print-employee-i-cards.component';
import { PRINT_EMPLOYEE_EXP_CERT, PRINT_EMPLOYEE_I_CARD, PRINT_EMPLOYEE_LIST } from '../../print/print-routes.constants';
import { PrintEmployeeListComponent } from './print/print-employee-list/print-employee-list.component';

const routes: Routes = [
    {
        path: '',
        component: EmployeeComponent,
    },
    {
        path: PRINT_EMPLOYEE_EXP_CERT,
        component: PrintEmployeeExpCertiComponent,
    },
    {
        path: PRINT_EMPLOYEE_I_CARD,
        component: PrintEmployeeICardsComponent,
    },
    {
        path: PRINT_EMPLOYEE_LIST,
        component: PrintEmployeeListComponent,
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
export class EmployeeRoutingModule { }
