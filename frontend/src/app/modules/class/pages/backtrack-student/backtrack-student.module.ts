import { NgModule } from '@angular/core';

import { BacktrackStudentRoutingModule } from './backtrack-student.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { BacktrackStudentComponent } from './backtrack-student.component';
import { ClassSectionModalComponent } from './class-section-modal/class-section-modal.component';

@NgModule({
    declarations: [ BacktrackStudentComponent, ClassSectionModalComponent ],

    imports: [
        BacktrackStudentRoutingModule,
        ComponentsModule
    ],
    exports: [],
    providers: [],
    bootstrap: [BacktrackStudentComponent],
    entryComponents: [ClassSectionModalComponent],
})
export class BacktrackStudentModule {}