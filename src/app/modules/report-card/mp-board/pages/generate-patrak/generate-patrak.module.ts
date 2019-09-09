import { NgModule } from '@angular/core';


import {GeneratePatrakRoutingModule, } from './generate-patrak.routing';
import {ComponentsModule} from "../../../../../components/components.module";
import {GeneratePatrakComponent} from "./generate-patrak.component";


@NgModule({
    declarations: [
        GeneratePatrakComponent
    ],

    imports: [
        GeneratePatrakRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [GeneratePatrakComponent]
})
export class GeneratePatrakModule { }
