import { NgModule } from '@angular/core';


import { ViewAttendanceRoutingModule} from './view-attendance.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {ViewAttendanceComponent} from "./view-attendance.component";


@NgModule({
    declarations: [
        ViewAttendanceComponent
    ],

    imports: [
        ViewAttendanceRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ViewAttendanceComponent]
})
export class ViewAttendanceModule { }
