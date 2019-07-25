import { NgModule } from '@angular/core';


import {CollectFeeRoutingModule} from './collect-fee.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {CollectFeeComponent} from "./collect-fee.component";
import {FeesComponentsModule} from "../../components/fees-components.module";


@NgModule({
    declarations: [
        CollectFeeComponent
    ],

    imports: [
        CollectFeeRoutingModule ,
        ComponentsModule,
        FeesComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [CollectFeeComponent]
})
export class CollectFeeModule { }
