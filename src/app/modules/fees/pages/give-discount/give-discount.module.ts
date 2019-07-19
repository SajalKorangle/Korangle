import { NgModule } from '@angular/core';


import {GiveDiscountRoutingModule} from './give-discount.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {GiveDiscountComponent} from "./give-discount.component";


@NgModule({
    declarations: [
        GiveDiscountComponent
    ],

    imports: [
        GiveDiscountRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [GiveDiscountComponent]
})
export class GiveDiscountModule { }
