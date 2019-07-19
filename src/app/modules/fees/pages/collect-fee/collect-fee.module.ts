import { NgModule } from '@angular/core';


import {CollectFeeRoutingModule} from './collect-fee.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {CollectFeeComponent} from "./collect-fee.component";


@NgModule({
    declarations: [
        CollectFeeComponent
    ],

    imports: [
        CollectFeeRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [CollectFeeComponent]
})
export class CollectFeeModule { }
