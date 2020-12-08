import { NgModule } from '@angular/core';

import { CheckHomeworkComponent } from "./check-homework.component";

import {CheckHomeworkRoutingModule } from './check-homework.routing';
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
    declarations: [
        CheckHomeworkComponent
    ],

    imports: [
        CheckHomeworkRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [CheckHomeworkComponent]
})
export class CheckHomeworkModule { }
