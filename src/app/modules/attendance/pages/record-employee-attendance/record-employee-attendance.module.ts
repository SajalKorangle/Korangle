import { NgModule } from '@angular/core';

import { RecordEmployeeAttendanceComponent } from "./record-employee-attendance.component";

// import {RecordEmployeeAttendanceRoutingModule } from './record-employee-attendance.routing';
import  {RecordEmployeeAttendanceRoutingModule} from './record-employee-attendance.routing';
import {ComponentsModule} from "../../../../components/components.module";

// RecordEmployeeAttendanceComponent
@NgModule({
    declarations: [
        RecordEmployeeAttendanceComponent
    ],

    imports: [
        RecordEmployeeAttendanceRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [RecordEmployeeAttendanceComponent]
})
export class RecordEmployeeAttendanceModule { }
