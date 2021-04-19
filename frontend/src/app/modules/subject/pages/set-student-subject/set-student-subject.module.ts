import { NgModule } from '@angular/core';

import { SetStudentSubjectRoutingModule } from './set-student-subject.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { SetStudentSubjectComponent } from './set-student-subject.component';

@NgModule({
    declarations: [SetStudentSubjectComponent],

    imports: [SetStudentSubjectRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [SetStudentSubjectComponent],
})
export class SetStudentSubjectModule {}
