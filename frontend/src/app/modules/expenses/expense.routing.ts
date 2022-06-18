import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { PRINT_EXPENSES } from '../../print/print-routes.constants';
import { PrintExpensesComponent } from './print/print-expenses/print-expenses.component';

const routes: Routes = [
    {
        path: 'expense_add_expense',
        loadChildren: 'app/modules/expenses/pages/add-expense/add-expense.module#AddExpenseModule',
        data: { moduleName: 'deprecated' },
    },
    {
        path: 'expense_expense_list',
        loadChildren: 'app/modules/expenses/pages/expense-list/expense-list.module#ExpenseListModule',
        data: { moduleName: 'deprecated' },
    },
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
