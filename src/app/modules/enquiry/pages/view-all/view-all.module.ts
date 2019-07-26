import { NgModule } from '@angular/core';

import { ViewAllComponent } from "./view-all.component";

import { ViewAllRoutingModule } from './view-all.routing';
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
    declarations: [

        ViewAllComponent,

    ],

    imports: [

        ViewAllRoutingModule,
        ComponentsModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ViewAllComponent]
})
export class ViewAllModule { }
