import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { PRINT_EXPENSES } from '../../print/print-routes.constants';
import { PrintExpensesComponent } from './print/print-expenses/print-expenses.component';

const routes: Routes = [
    {
        path: PRINT_EXPENSES,
        component: PrintExpensesComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ExpenseRoutingModule {}
