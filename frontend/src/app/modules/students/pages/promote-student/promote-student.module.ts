import { NgModule } from '@angular/core';

import { PromoteStudentRoutingModule } from './promote-student.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { PromoteStudentComponent } from './promote-student.component';

@NgModule({
    declarations: [PromoteStudentComponent],

    imports: [PromoteStudentRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [PromoteStudentComponent],
})
export class PromoteStudentModule {}
