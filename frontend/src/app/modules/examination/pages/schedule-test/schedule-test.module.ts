import { NgModule } from '@angular/core';

import { ScheduleTestRoutingModule } from './schedule-test.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { ScheduleTestComponent } from '../schedule-test/schedule-test.component';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
    declarations: [ScheduleTestComponent],

    imports: [ScheduleTestRoutingModule, ComponentsModule, MatNativeDateModule],
    exports: [],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
    bootstrap: [ScheduleTestComponent],
})
export class ScheduleTestModule {}
