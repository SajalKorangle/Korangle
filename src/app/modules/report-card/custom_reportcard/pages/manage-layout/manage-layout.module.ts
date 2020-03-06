import { NgModule } from '@angular/core';

import {ComponentsModule} from "../../../../../components/components.module";

import { ManageLayoutRouting } from './manage-layout.routing';
import {ManageLayoutComponent} from "./manage-layout.component";


import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [
        ManageLayoutComponent
    ],

    imports: [
        ManageLayoutRouting ,
        ComponentsModule,
        DragDropModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ManageLayoutComponent]
})
export class ManageLayoutModule { }
