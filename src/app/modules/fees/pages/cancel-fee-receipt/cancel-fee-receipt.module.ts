import { NgModule } from '@angular/core';


import {CancelFeeReceiptRoutingModule} from './cancel-fee-receipt.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {CancelFeeReceiptComponent} from "./cancel-fee-receipt.component";


@NgModule({
    declarations: [
        CancelFeeReceiptComponent
    ],

    imports: [
        CancelFeeReceiptRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [CancelFeeReceiptComponent]
})
export class CancelFeeReceiptModule { }
