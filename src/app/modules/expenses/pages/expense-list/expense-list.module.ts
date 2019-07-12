import { NgModule } from '@angular/core';

import { ExpenseListComponent } from './expense-list.component';

import {ExpenseListRoutingModule} from './expense-list.routing';
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
    declarations: [

        ExpenseListComponent,

    ],

    imports: [

        ExpenseListRoutingModule,
        ComponentsModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ExpenseListComponent]
})
export class ExpenseListModule { }
