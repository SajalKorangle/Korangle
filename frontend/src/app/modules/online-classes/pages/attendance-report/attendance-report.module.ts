import { NgModule } from '@angular/core';

import { AttendanceReportComponent } from "./attendance-report.component";
import { AttendanceReportRouting } from "./attendance-report.routing";
import {ComponentsModule} from "@components/components.module";

@NgModule({
    declarations: [
        AttendanceReportComponent,
    ],
    imports: [
        AttendanceReportRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ AttendanceReportComponent ]
})
export class AttendanceReportModule { }
