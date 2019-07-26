import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { PRINT_EXPENSES } from 'app/print/print-routes.constants';
import { PrintExpensesComponent } from './print/print-expenses/print-expenses.component';

const routes: Routes = [
    {
        path: 'add_expense',
        loadChildren: 'app/modules/expenses/pages/add-expense/add-expense.module#AddExpenseModule',
        data: {moduleName: 'expenses'},
    },
    {
        path: 'expense_list',
        loadChildren: 'app/modules/expenses/pages/expense-list/expense-list.module#ExpenseListModule',
        data: {moduleName: 'expenses'},
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
