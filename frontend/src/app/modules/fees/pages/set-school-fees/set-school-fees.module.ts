import { NgModule } from '@angular/core';

import { SetSchoolFeesRoutingModule } from './set-school-fees.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { SetSchoolFeesComponent } from './set-school-fees.component';

@NgModule({
    declarations: [SetSchoolFeesComponent],

    imports: [SetSchoolFeesRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [SetSchoolFeesComponent],
})
export class SetSchoolFeesModule {}
