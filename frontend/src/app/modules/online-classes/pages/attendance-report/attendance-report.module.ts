import { NgModule } from '@angular/core';

import { AttendanceReportComponent } from "./attendance-report.component";
import { AttendanceReportRouting } from "./attendance-report.routing";
import { ComponentsModule } from "@components/components.module";
import { MatTableModule } from '@angular/material/table';
import { MAT_DATE_LOCALE } from '@angular/material/core';

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
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
    bootstrap: [AttendanceReportComponent]
})
export class AttendanceReportModule { }
