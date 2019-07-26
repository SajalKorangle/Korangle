import { NgModule } from '@angular/core';

import { AssignTaskComponent } from "./assign-task.component";

import {AssignTaskRoutingModule } from './assign-task.routing';
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
    declarations: [
        AssignTaskComponent
    ],

    imports: [
        AssignTaskRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [AssignTaskComponent]
})
export class AssignTaskModule { }
