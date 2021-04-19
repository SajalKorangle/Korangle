import { NgModule } from '@angular/core';

import { ApplyLeaveRoutingModule } from './apply-leave.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { ApplyLeaveComponent } from './apply-leave.component';

@NgModule({
    declarations: [ApplyLeaveComponent],

    imports: [ApplyLeaveRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [ApplyLeaveComponent],
})
export class ApplyLeaveModule {}
