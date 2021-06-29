import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { TCComponent } from './tc.component';
import { TCRoutingModule } from './tc.routing';

@NgModule({
    declarations: [TCComponent],
    imports: [ComponentsModule, TCRoutingModule],
    bootstrap: [TCComponent],
})
export class TCModule {}
