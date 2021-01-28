import { NgModule } from '@angular/core';


import {ComponentsModule} from "../../../../components/components.module";
import {OnlinePaymentAccountComponent} from "./online-payment-account.component";
import {FeesComponentsModule} from "../../components/fees-components.module";
import { OnlinePaymentAccountRoutingModule } from './online-payment-account.routing';

@NgModule({
    declarations: [
        OnlinePaymentAccountComponent
    ],

    imports: [
        OnlinePaymentAccountRoutingModule ,
        ComponentsModule,
        FeesComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [OnlinePaymentAccountComponent]
})
export class OnlinePaymentAccountModule { }
