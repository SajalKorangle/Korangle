import { NgModule } from '@angular/core';
import { CreateGradeComponent } from './create-grade.component';
import { CreateGradeRouting } from './create-grade.routing';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
    declarations: [CreateGradeComponent],
    imports: [CreateGradeRouting, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [CreateGradeComponent],
})
export class CreateGradeModule {}
