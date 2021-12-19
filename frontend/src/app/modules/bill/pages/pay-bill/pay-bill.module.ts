import { NgModule } from '@angular/core';

import { PayBillComponent } from "./pay-bill.component";

import {PayBillRoutingModule } from './pay-bill.routing';
import {ComponentsModule} from "../../../../components/components.module";



@NgModule({
    declarations: [
        PayBillComponent,
    ],

    imports: [
        PayBillRoutingModule ,
        ComponentsModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [PayBillComponent],

})
export class PayBillModule { }
