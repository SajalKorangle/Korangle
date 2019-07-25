import { NgModule } from '@angular/core';


import {GiveDiscountRoutingModule} from './give-discount.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {GiveDiscountComponent} from "./give-discount.component";
import {FeesComponentsModule} from "../../components/fees-components.module";


@NgModule({
    declarations: [
        GiveDiscountComponent
    ],

    imports: [
        GiveDiscountRoutingModule ,
        ComponentsModule,
        FeesComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [GiveDiscountComponent]
})
export class GiveDiscountModule { }
