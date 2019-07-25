import { NgModule } from '@angular/core';


import { ViewFeeRoutingModule} from './view-fee.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {ViewFeeComponent} from "./view-fee.component";


@NgModule({
    declarations: [
        ViewFeeComponent
    ],

    imports: [
        ViewFeeRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ViewFeeComponent]
})
export class ViewFeeModule { }
