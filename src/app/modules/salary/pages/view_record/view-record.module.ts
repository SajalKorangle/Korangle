import { NgModule } from '@angular/core';


import { ViewRecordRoutingModule} from './view-record.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {ViewRecordComponent} from "./view-record.component";


@NgModule({
    declarations: [
        ViewRecordComponent
    ],

    imports: [
        ViewRecordRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ViewRecordComponent]
})
export class ViewRecordModule { }
