import { NgModule } from '@angular/core';


import { ComponentsModule } from "../../../../components/components.module";
import { OnlinePaymentAccountComponent } from "./online-payment-account.component";
import { FeesComponentsModule } from "../../components/fees-components.module";
import { OnlinePaymentAccountRoutingModule } from './online-payment-account.routing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [
        OnlinePaymentAccountComponent
    ],

    imports: [
        OnlinePaymentAccountRoutingModule,
        ComponentsModule,
        FeesComponentsModule,
        MatProgressSpinnerModule
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [OnlinePaymentAccountComponent]
})
export class OnlinePaymentAccountModule { }
