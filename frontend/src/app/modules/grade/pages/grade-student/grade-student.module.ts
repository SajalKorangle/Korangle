import { NgModule } from '@angular/core';
import { GradeStudentComponent } from './grade-student.component';
import { GradeStudentRouting } from './grade-student.routing';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
    declarations: [GradeStudentComponent],
    imports: [ComponentsModule, GradeStudentRouting],
    exports: [],
    providers: [],
    bootstrap: [GradeStudentComponent],
})
export class GradeStudentModule {}
