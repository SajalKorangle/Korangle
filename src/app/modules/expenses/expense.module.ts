import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { ExpenseComponent } from './expense.component';

import { ExpenseListComponent } from './expense-list/expense-list.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';

import {ExpenseRoutingModule} from './expense.routing';


@NgModule({
    declarations: [

        ExpenseComponent,

        ExpenseListComponent,
        AddExpenseComponent,

    ],

    imports: [

        ExpenseRoutingModule,
        ComponentsModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ExpenseComponent]
})
export class ExpenseModule { }
