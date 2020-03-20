import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { AttendanceComponent } from './attendance.component';

import { AttendanceRoutingModule } from './attendance.routing';
import { AttendanceOldService } from '../../services/modules/attendance/attendance-old.service';

import { PrintStudentAttendanceListComponent } from './print/print-student-attendance-list/print-student-attendance-list.component';
import { PrintEmployeeAttendanceListComponent } from './print/print-employee-attendance-list/print-employee-attendance-list.component';
import {ExcelService} from "../../excel/excel-service";

@NgModule({
    declarations: [
        AttendanceComponent,
        PrintStudentAttendanceListComponent,
        PrintEmployeeAttendanceListComponent
    ],

    imports: [
        ComponentsModule,
        AttendanceRoutingModule,
    ],
    exports: [],
    providers: [AttendanceOldService, ExcelService],
    bootstrap: [AttendanceComponent]
})
export class AttendanceModule { }
