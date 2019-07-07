import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { AttendanceComponent } from './attendance.component';

import { DeclareHolidaysComponent } from './pages/declare-holidays/declare-holidays.component';
import { GivePermissionsComponent } from './pages/give-permissions/give-permissions.component';
import { RecordAttendanceComponent } from './pages/record-attendance/record-attendance.component';
import { RecordEmployeeAttendanceComponent } from './pages/record-employee-attendance/record-employee-attendance.component';
import { ApproveLeaveComponent } from './pages/approve-leave/approve-leave.component';
import { AttendanceRoutingModule } from './attendance.routing';
import { AttendanceService } from './attendance.service';

import { PrintStudentAttendanceListComponent } from './print/print-student-attendance-list/print-student-attendance-list.component';
import { PrintEmployeeAttendanceListComponent } from './print/print-employee-attendance-list/print-employee-attendance-list.component';
import {ExcelService} from "../../excel/excel-service";

@NgModule({
    declarations: [
        AttendanceComponent,
        DeclareHolidaysComponent,
        GivePermissionsComponent,
        RecordAttendanceComponent,
        RecordEmployeeAttendanceComponent,
        ApproveLeaveComponent,
        PrintStudentAttendanceListComponent,
        PrintEmployeeAttendanceListComponent
    ],

    imports: [
        ComponentsModule,
        AttendanceRoutingModule,
    ],
    exports: [],
    providers: [AttendanceService, ExcelService],
    bootstrap: [AttendanceComponent]
})
export class AttendanceModule { }
