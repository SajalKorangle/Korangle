import { NgModule } from '@angular/core';

import { AttendanceReportComponent } from "./attendance-report.component";
import { AttendanceReportRouting } from "./attendance-report.routing";
import { ComponentsModule } from "@components/components.module";
import { MatTableModule } from '@angular/material/table';

@NgModule({
    declarations: [
        AttendanceReportComponent,
    ],
    imports: [
        AttendanceReportRouting,
        ComponentsModule,
        MatTableModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [AttendanceReportComponent]
})
export class AttendanceReportModule { }
