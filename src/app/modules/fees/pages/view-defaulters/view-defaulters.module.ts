import { NgModule } from '@angular/core';


import { ViewDefaultersRoutingModule} from './view-defaulters.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {ViewDefaultersComponent} from "./view-defaulters.component";


@NgModule({
    declarations: [
        ViewDefaultersComponent
    ],

    imports: [
        ViewDefaultersRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ViewDefaultersComponent]
})
export class ViewDefaultersModule { }
