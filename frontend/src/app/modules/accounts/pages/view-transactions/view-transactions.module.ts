import { NgModule } from '@angular/core';

import { ViewTransactionsComponent } from './view-transactions.component';

import { ViewTransactionsRoutingModule } from './view-transactions.routing';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
    declarations: [ViewTransactionsComponent],

    imports: [ViewTransactionsRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [ViewTransactionsComponent],
})
export class ViewTransactionsModule {}
