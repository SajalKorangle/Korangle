import { NgModule } from '@angular/core';


import { ViewMarksRouting} from './view-marks.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {ViewMarksComponent} from "./view-marks.component";


@NgModule({
    declarations: [
        ViewMarksComponent
    ],

    imports: [
        ViewMarksRouting ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ViewMarksComponent]
})
export class ViewMarksModule { }
