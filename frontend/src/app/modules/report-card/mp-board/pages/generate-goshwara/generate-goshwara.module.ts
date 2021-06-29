import { NgModule } from '@angular/core';

import { GenerateGoshwaraRoutingModule } from './generate-goshwara.routing';
import { ComponentsModule } from '../../../../../components/components.module';
import { GenerateGoshwaraComponent } from './generate-goshwara.component';

@NgModule({
    declarations: [GenerateGoshwaraComponent],

    imports: [GenerateGoshwaraRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [GenerateGoshwaraComponent],
})
export class GenerateGoshwaraModule {}
