import { NgModule } from '@angular/core';

import { TransferBalanceComponent } from "./transfer-balance.component";
import { TransferBalanceRoutingModule } from "./transfer-balance.routing"
import {ComponentsModule} from "../../../../components/components.module";

@NgModule({
    declarations: [
        TransferBalanceComponent
    ],

    imports: [
        TransferBalanceRoutingModule,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [TransferBalanceComponent]
})
export class TransferBalanceModule { } 