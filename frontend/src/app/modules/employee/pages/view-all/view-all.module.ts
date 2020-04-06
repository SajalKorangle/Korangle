import { NgModule } from '@angular/core';


import {ViewAllRoutingModule} from './view-all.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {ViewAllComponent} from "./view-all.component";


@NgModule({
    declarations: [
        ViewAllComponent
    ],

    imports: [
        ViewAllRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ViewAllComponent]
})
export class ViewAllModule { }
