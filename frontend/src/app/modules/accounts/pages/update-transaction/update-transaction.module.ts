import { NgModule } from '@angular/core';

import { UpdateTransactionComponent } from "./update-transaction.component";

import {UpdateTransactionRoutingModule } from './update-transaction.routing';
import {ComponentsModule} from "../../../../components/components.module";
import { AccountsComponentsModule  } from './../../components/component.module'


@NgModule({
    declarations: [
        UpdateTransactionComponent,
    ],

    imports: [
        UpdateTransactionRoutingModule ,
        ComponentsModule,
        AccountsComponentsModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [UpdateTransactionComponent],
    
})
export class UpdateTransactionModule { }
