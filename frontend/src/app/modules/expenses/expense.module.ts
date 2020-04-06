import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { ExpenseComponent } from './expense.component';

import {ExpenseRoutingModule} from './expense.routing';
import { PrintExpensesComponent } from './print/print-expenses/print-expenses.component';


@NgModule({
    declarations: [

        ExpenseComponent,
        PrintExpensesComponent

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
