import { NgModule } from '@angular/core';

import { LockFeesRoutingModule } from './lock-fees.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { LockFeesComponent } from './lock-fees.component';

@NgModule({
    declarations: [LockFeesComponent],

    imports: [LockFeesRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [LockFeesComponent],
})
export class LockFeesModule {}
