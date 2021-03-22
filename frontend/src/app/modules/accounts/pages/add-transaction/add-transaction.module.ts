import { NgModule } from '@angular/core';

import { AddTransactionComponent } from "./add-transaction.component";

import {AddTransactionRoutingModule } from './add-transaction.routing';
import {ComponentsModule} from "../../../../components/components.module";



@NgModule({
    declarations: [
        AddTransactionComponent,
    ],

    imports: [
        AddTransactionRoutingModule ,
        ComponentsModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [AddTransactionComponent],
    
})
export class AddTransactionModule { }
