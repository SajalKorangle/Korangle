import { NgModule } from '@angular/core';

import { BacktrackStudentRoutingModule } from './backtrack-student.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { BacktrackStudentComponent } from './backtrack-student.component';

@NgModule({
    declarations: [ BacktrackStudentComponent ],

    imports: [
        BacktrackStudentRoutingModule,
        ComponentsModule
    ],
    exports: [],
    providers: [],
    bootstrap: [BacktrackStudentComponent],
})
export class BacktrackStudentModule {}