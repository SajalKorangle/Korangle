import { NgModule } from '@angular/core';

import { ManageStudentSessionsRoutingModule } from './manage-student-sessions.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { ManageStudentSessionsComponent } from './manage-student-sessions.component';

@NgModule({
    declarations: [ManageStudentSessionsComponent],

    imports: [ManageStudentSessionsRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [ManageStudentSessionsComponent],
})
export class ManageStudentSessionsModule {}