import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FeeReceiptListComponent} from "./fee-receipt-list/fee-receipt-list-component.component";
import {DiscountListComponent} from "./discount-list/discount-list-component.component";


@NgModule({
    declarations: [

        FeeReceiptListComponent,
        DiscountListComponent,

    ],

    imports: [

        CommonModule,

    ],
    exports: [

        CommonModule,

        FeeReceiptListComponent,
        DiscountListComponent,

    ],
    providers: [],
    bootstrap: [],
})
export class FeesComponentsModule { }
