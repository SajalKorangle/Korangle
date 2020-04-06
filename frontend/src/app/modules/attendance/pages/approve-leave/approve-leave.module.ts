import { NgModule } from '@angular/core';

import {ApproveLeaveRoutingModule } from './approve-leave.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {ApproveLeaveComponent} from "./approve-leave.component";

@NgModule({
    declarations: [
        ApproveLeaveComponent
    ],

    imports: [
        ApproveLeaveRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ApproveLeaveComponent]
})
export class ApproveLeaveModule { }
