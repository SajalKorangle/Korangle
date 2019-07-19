import { NgModule } from '@angular/core';


import { ViewPaymentRoutingModule} from './view-payment.routing';
import {ComponentsModule} from "../../.././components/components.module";
import {ViewPaymentComponent} from "./view-payment.component";


@NgModule({
    declarations: [
        ViewPaymentComponent
    ],

    imports: [
        ViewPaymentRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ViewPaymentComponent]
})
export class ViewPaymentModule { }
