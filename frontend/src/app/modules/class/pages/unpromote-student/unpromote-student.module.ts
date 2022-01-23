import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../../../components/components.module';
import { UnpromoteStudentComponent } from './unpromote-student.component';
import { UnpromoteStudentRoutingModule } from './unpromote-student.routing';

@NgModule({
    declarations: [UnpromoteStudentComponent],

    imports: [UnpromoteStudentRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [UnpromoteStudentComponent],
})
export class UnpromoteStudentModule {}
