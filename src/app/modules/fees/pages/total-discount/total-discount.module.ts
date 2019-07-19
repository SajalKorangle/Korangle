import { NgModule } from '@angular/core';


import { TotalDiscountRoutingModule} from './total-discount.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {TotalDiscountComponent} from "./total-discount.component";


@NgModule({
    declarations: [
        TotalDiscountComponent
    ],

    imports: [
        TotalDiscountRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [TotalDiscountComponent]
})
export class TotalDiscountModule { }
