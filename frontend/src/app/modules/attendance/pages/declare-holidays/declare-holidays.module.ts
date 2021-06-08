import { NgModule } from '@angular/core';

import { DeclareHolidaysComponent } from './declare-holidays.component';

import { DeclareHolidaysRoutingModule } from './declare-holidays.routing';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
    declarations: [DeclareHolidaysComponent],

    imports: [DeclareHolidaysRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [DeclareHolidaysComponent],
})
export class DeclareHolidaysModule {}
