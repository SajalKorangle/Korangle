import { NgModule } from '@angular/core';

import { SetSchoolFeesRoutingModule } from './set-school-fees.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { SetSchoolFeesComponent } from './set-school-fees.component';
import { ShowStudentListModalComponent } from './show-student-list-modal/show-student-list-modal.component';

@NgModule({
    declarations: [SetSchoolFeesComponent, ShowStudentListModalComponent],

    imports: [SetSchoolFeesRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [SetSchoolFeesComponent],
    entryComponents: [ShowStudentListModalComponent]
})
export class SetSchoolFeesModule {}
