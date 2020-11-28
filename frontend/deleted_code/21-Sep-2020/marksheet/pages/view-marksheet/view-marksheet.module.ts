import { NgModule } from '@angular/core';


import { ViewMarksheetRoutingModule} from './view-marksheet.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {ViewMarksheetComponent} from "./view-marksheet.component";


@NgModule({
    declarations: [
        ViewMarksheetComponent
    ],

    imports: [
        ViewMarksheetRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ViewMarksheetComponent]
})
export class ViewMarksheetModule { }
