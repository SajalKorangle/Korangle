import { NgModule } from '@angular/core';

import { CountAllStudentAttendanceComponent } from './count-all-student-attendance.component';

import { CountAllStudentAttendanceRoutingModule } from './count-all-student-attendance.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { ShowStudentListModalComponent } from './component/show-student-list-modal/show-student-list-modal.component';
import { LocalComponentsModule } from './component/local-components.module';

@NgModule({
    declarations: [CountAllStudentAttendanceComponent],

    imports: [
        CountAllStudentAttendanceRoutingModule,
        ComponentsModule,
        LocalComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [CountAllStudentAttendanceComponent],
    entryComponents: [ShowStudentListModalComponent],
})
export class CountAllStudentAttendanceModule {}
