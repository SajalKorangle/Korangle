import { NgModule } from '@angular/core';

import { CountAllStudentAttendanceComponent } from './count-all-student-attendance.component';

import { CountAllStudentAttendanceRoutingModule } from './count-all-student-attendance.routing';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
    declarations: [CountAllStudentAttendanceComponent],

    imports: [CountAllStudentAttendanceRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [CountAllStudentAttendanceComponent],
})
export class CountAllStudentAttendanceModule {}
