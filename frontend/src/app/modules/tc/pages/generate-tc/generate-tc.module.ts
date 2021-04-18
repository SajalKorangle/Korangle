import { NgModule } from '@angular/core';

import { GenerateTCRoutingModule } from './generate-tc.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { GenerateTCComponent } from './generate-tc.component';

@NgModule({
    declarations: [GenerateTCComponent],

    imports: [GenerateTCRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [GenerateTCComponent],
})
export class GenerateTCModule {}
