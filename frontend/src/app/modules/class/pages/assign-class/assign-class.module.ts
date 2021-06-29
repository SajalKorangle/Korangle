import { NgModule } from '@angular/core';

import { AssignClassComponent } from './assign-class.component';

import { AssignClassRoutingModule } from './assign-class.routing';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
    declarations: [AssignClassComponent],

    imports: [AssignClassRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [AssignClassComponent],
})
export class AssignClassModule {}
