import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { ParentComponent } from './parent.component';

import { ViewProfileComponent } from './pages/view-profile/view-profile.component';
import { ViewAttendanceComponent } from './pages/view-attendance/view-attendance.component';
import { ViewMarksComponent } from './pages/view-marks/view-marks.component';
import { ViewFeeComponent } from "./pages/view-fee/view-fee.component";

import { ParentRoutingModule } from './parent.routing';

import { ParentService } from './parent.service';

@NgModule({
    declarations: [

        ParentComponent,
        // ViewProfileComponent,
        // ViewAttendanceComponent,
        // ViewMarksComponent,
        // ViewFeeComponent,

    ],

    imports: [

        ComponentsModule,
        ParentRoutingModule,

    ],
    exports: [
    ],
    providers: [ParentService],
    bootstrap: [ParentComponent],
})
export class ParentModule { }
