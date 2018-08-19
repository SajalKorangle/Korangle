import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { AttendanceComponent } from './attendance.component';

import { DeclareHolidaysComponent } from './pages/declare-holidays/declare-holidays.component';
import { GivePermissionsComponent } from './pages/give-permissions/give-permissions.component';
import { RecordAttendanceComponent } from './pages/record-attendance/record-attendance.component';
import { ViewClassAttendanceComponent } from './pages/view-class-attendance/view-class-attendance.component';
import { ViewStudentAttendanceComponent } from './pages/view-student-attendance/view-student-attendance.component';

import { AttendanceRoutingModule } from './attendance.routing';

import { AttendanceService } from './attendance.service';

@NgModule({
    declarations: [

        AttendanceComponent,

        DeclareHolidaysComponent,
        GivePermissionsComponent,
        RecordAttendanceComponent,
        ViewClassAttendanceComponent,
        ViewStudentAttendanceComponent,

    ],

    imports: [

        ComponentsModule,
        AttendanceRoutingModule,

    ],
    exports: [
    ],
    providers: [AttendanceService],
    bootstrap: [AttendanceComponent]
})
export class AttendanceModule { }
