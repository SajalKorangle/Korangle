import { NgModule } from '@angular/core';


import {ViewMarksRoutingModule} from './view-marks.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {ViewMarksComponent} from "./view-marks.component";


@NgModule({
    declarations: [
        ViewMarksComponent
    ],

    imports: [
        ViewMarksRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ViewMarksComponent]
})
export class ViewMarksModule { }
