import { NgModule } from '@angular/core';

import { UpdateAllRoutingModule } from './update-all.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { UpdateAllComponent } from './update-all.component';

@NgModule({
    declarations: [UpdateAllComponent],

    imports: [UpdateAllRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [UpdateAllComponent],
})
export class UpdateAllModule {}
