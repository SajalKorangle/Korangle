import { NgModule } from '@angular/core';

import { UpdateStudentFeesRoutingModule } from './update-student-fees.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { UpdateStudentFeesComponent } from './update-student-fees.component';

@NgModule({
    declarations: [UpdateStudentFeesComponent],

    imports: [UpdateStudentFeesRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [UpdateStudentFeesComponent],
})
export class UpdateStudentFeesModule {}
