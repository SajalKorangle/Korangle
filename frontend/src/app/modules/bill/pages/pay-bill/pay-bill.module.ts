import { NgModule } from '@angular/core';

import { PayBillComponent } from "./pay-bill.component";

import {PayBillRoutingModule } from './pay-bill.routing';
import {ComponentsModule} from "../../../../components/components.module";
import { PaymentModalComponent } from './payment-modal/payment-modal.component';

@NgModule({
    declarations: [
        PayBillComponent,
        PaymentModalComponent
    ],

    imports: [
        PayBillRoutingModule ,
        ComponentsModule,

    ],
    entryComponents: [ PaymentModalComponent ],
    exports: [
    ],
    providers: [],
    bootstrap: [PayBillComponent],

})
export class PayBillModule { }
