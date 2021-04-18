import { NgModule } from '@angular/core';

import { RecordAttendanceComponent } from './record-attendance.component';

import { RecordAttendanceRoutingModule } from './record-attendance.routing';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
    declarations: [RecordAttendanceComponent],

    imports: [RecordAttendanceRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [RecordAttendanceComponent],
})
export class RecordAttendanceModule {}
