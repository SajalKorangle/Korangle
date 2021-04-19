import { NgModule } from '@angular/core';

import { ViewStudentRemarksRouting } from './view-student-remarks.routing';
import { ComponentsModule } from '@components/components.module';
import { ViewStudentRemarksComponent } from './view-student-remarks.component';

@NgModule({
    declarations: [ViewStudentRemarksComponent],

    imports: [ViewStudentRemarksRouting, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [ViewStudentRemarksComponent],
})
export class ViewStudentRemarksModule {}
