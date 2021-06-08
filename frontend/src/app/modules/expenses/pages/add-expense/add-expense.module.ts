import { NgModule } from '@angular/core';

import { AddExpenseComponent } from './add-expense.component';

import { AddExpenseRoutingModule } from './add-expense.routing';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
    declarations: [AddExpenseComponent],

    imports: [AddExpenseRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [AddExpenseComponent],
})
export class AddExpenseModule {}
