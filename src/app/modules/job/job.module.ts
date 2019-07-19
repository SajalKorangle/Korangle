import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { JobComponent } from './job.component';

import { ViewProfileComponent } from './view-profile/view-profile.component';
import { ViewAttendanceComponent } from './view-attendance/view-attendance.component';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { ViewPaymentComponent } from './view-payment/view-payment.component';

import { JobRoutingModule } from './job.routing';

@NgModule({
    declarations: [

        JobComponent,

        // ViewProfileComponent,
        // ViewAttendanceComponent,
        // ApplyLeaveComponent,
        // ViewPaymentComponent,

    ],

    imports: [

        ComponentsModule,
        JobRoutingModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [JobComponent]
})
export class JobModule { }
