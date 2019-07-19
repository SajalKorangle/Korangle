import { NgModule } from '@angular/core';


import { UpdateMarksRoutingModule} from './update-marks.routing';
import {ComponentsModule} from "../../.././components/components.module";
import {UpdateMarksComponent} from "./update-marks.component";


@NgModule({
    declarations: [
        UpdateMarksComponent
    ],

    imports: [
        UpdateMarksRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [UpdateMarksComponent]
})
export class UpdateMarksModule { }
