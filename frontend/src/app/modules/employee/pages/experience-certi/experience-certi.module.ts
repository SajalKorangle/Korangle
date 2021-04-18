import { NgModule } from '@angular/core';

import { ExperienceCertiRoutingModule } from './experience-certi.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { ExperienceCertiComponent } from './experience-certi.component';

@NgModule({
    declarations: [ExperienceCertiComponent],

    imports: [ExperienceCertiRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [ExperienceCertiComponent],
})
export class ExperienceCertiModule {}
