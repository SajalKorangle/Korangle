import { NgModule } from '@angular/core';

import { AttendanceReportComponent } from "./attendance-report.component";
import { AttendanceReportRouting } from "./attendance-report.routing";
import { ComponentsModule } from "@components/components.module";
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
    declarations: [
        AttendanceReportComponent,
    ],
    imports: [
        AttendanceReportRouting,
        ComponentsModule,
        MatTableModule,
        MatSnackBarModule
    ],
    exports: [],
    providers: [],
    bootstrap: [AttendanceReportComponent]
})
export class AttendanceReportModule { }
