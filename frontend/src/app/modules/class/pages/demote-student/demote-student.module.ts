import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../../../components/components.module';
import { DemoteStudentComponent } from './demote-student.component';
import { DemoteStudentRoutingModule } from './demote-student.routing';

@NgModule({
    declarations: [DemoteStudentComponent],

    imports: [DemoteStudentRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [DemoteStudentComponent],
})
export class DemoteStudentModule {}
