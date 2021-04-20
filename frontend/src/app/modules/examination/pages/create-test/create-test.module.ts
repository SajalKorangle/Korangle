import { NgModule } from '@angular/core';

import { CreateTestRoutingModule } from './create-test.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { CreateTestComponent } from './create-test.component';

@NgModule({
    declarations: [CreateTestComponent],

    imports: [CreateTestRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [CreateTestComponent],
})
export class CreateTestModule {}
