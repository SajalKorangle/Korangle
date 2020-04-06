import { NgModule } from '@angular/core';

import {ComponentsModule} from "../../../../../components/components.module";

import { ManageLayoutRouting } from './manage-layout.routing';
import {ManageLayoutComponent} from "./manage-layout.component";


import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatStepperModule} from '@angular/material/stepper';

@NgModule({
    declarations: [
        ManageLayoutComponent
    ],

    imports: [
        ManageLayoutRouting ,
        ComponentsModule,
        DragDropModule,
        MatStepperModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ManageLayoutComponent]
})
export class ManageLayoutModule { }
