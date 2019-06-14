import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ExpenseComponent } from './expense.component';
import { PRINT_EXPENSES } from 'app/print/print-routes.constants';
import { PrintExpensesComponent } from './print/print-expenses/print-expenses.component';

const routes: Routes = [
    {
        path: '',
        component: ExpenseComponent,
    },
    {
        path: PRINT_EXPENSES,
        component: PrintExpensesComponent,
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
export class ExpenseRoutingModule { }
