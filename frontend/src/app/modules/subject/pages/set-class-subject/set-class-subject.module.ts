import { NgModule } from '@angular/core';

import { SetClassSubjectRoutingModule } from './set-class-subject.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { SetClassSubjectComponent } from './set-class-subject.component';

@NgModule({
    declarations: [SetClassSubjectComponent],

    imports: [SetClassSubjectRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [SetClassSubjectComponent],
})
export class SetClassSubjectModule {}
