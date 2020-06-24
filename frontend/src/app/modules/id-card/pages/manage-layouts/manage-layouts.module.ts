import { NgModule } from '@angular/core';


import {ManageLayoutsRoutingModule} from './manage-layouts.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';


import {ManageLayoutsComponent} from "./manage-layouts.component";


@NgModule({
    declarations: [
        ManageLayoutsComponent
    ],

    imports: [
        ManageLayoutsRoutingModule ,
        ComponentsModule,
        DragDropModule,
        MatButtonToggleModule,
        MatIconModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ManageLayoutsComponent]
})
export class ManageLayoutsModule { }