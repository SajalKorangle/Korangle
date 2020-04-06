import { NgModule } from '@angular/core';

import { UpdateCceMarksoutingModule} from './update-cce-marks.routing';
import {ComponentsModule} from "../../../../../components/components.module";
import {UpdateCceMarksComponent} from "./update-cce-marks.component";


@NgModule({
    declarations: [
        UpdateCceMarksComponent
    ],

    imports: [
        UpdateCceMarksoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [UpdateCceMarksComponent]
})
export class UpdateCceMarksModule { }
