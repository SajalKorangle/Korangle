import { NgModule } from '@angular/core';


import {GenerateTcRoutingModule} from './generate-tc.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {GenerateTcComponent} from "./generate-tc.component";


@NgModule({
    declarations: [
        GenerateTcComponent
    ],

    imports: [
        GenerateTcRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [GenerateTcComponent]
})
export class GenerateTcModule { }
