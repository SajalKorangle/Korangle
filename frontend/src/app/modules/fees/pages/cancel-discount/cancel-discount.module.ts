import { NgModule } from '@angular/core';


import {CancelDiscountRoutingModule} from './cancel-discount.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {CancelDiscountComponent} from "./cancel-discount.component";


@NgModule({
    declarations: [
        CancelDiscountComponent
    ],

    imports: [
        CancelDiscountRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [CancelDiscountComponent]
})
export class CancelDiscountModule { }
