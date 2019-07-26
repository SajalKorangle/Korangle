import { NgModule } from '@angular/core';


import { ViewSentRoutingModule} from './view-sent.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {ViewSentComponent} from "./view-sent.component";


@NgModule({
    declarations: [
        ViewSentComponent
    ],

    imports: [
        ViewSentRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ViewSentComponent]
})
export class ViewSentModule { }
