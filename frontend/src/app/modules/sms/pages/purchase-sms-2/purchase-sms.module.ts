import { NgModule } from '@angular/core';
import {ComponentsModule} from "../../../../components/components.module";
import { PurchaseSmsComponent } from './purchase-sms.component';
import { PurchaseSmsRoutingModule} from './purchase-sms.routing';


@NgModule({
    declarations: [
        PurchaseSmsComponent
    ],

    imports: [
        ComponentsModule,
        PurchaseSmsRoutingModule
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [PurchaseSmsComponent]
})
export class PurchaseSmsModule { }
