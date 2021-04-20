import { NgModule } from '@angular/core';

import { AddTransactionComponent } from "./add-transaction.component";

import {AddTransactionRoutingModule } from './add-transaction.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {AccountsComponentsModule} from '@modules/accounts/components/component.module';



@NgModule({
    declarations: [
        AddTransactionComponent,
    ],

    imports: [
        AddTransactionRoutingModule,
        ComponentsModule,
        AccountsComponentsModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [AddTransactionComponent],

})
export class AddTransactionModule { }
