import { NgModule } from '@angular/core';

import { TransferBalanceComponent } from "./transfer-balance.component";
import { TransferBalanceRoutingModule } from "./transfer-balance.routing";
import {ComponentsModule} from "../../../../components/components.module";
import { AccountsComponentsModule } from './../../components/component.module';

@NgModule({
    declarations: [
        TransferBalanceComponent
    ],

    imports: [
        TransferBalanceRoutingModule,
        ComponentsModule,
        AccountsComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [TransferBalanceComponent]
})
export class TransferBalanceModule { }