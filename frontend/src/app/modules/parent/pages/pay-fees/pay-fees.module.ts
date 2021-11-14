import { NgModule } from '@angular/core';

import { PayFeesRoutingModule } from './pay-fees.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { PayFeesComponent } from './pay-fees.component';
import { FeesComponentsModule } from '../../../fees/components/fees-components.module';

@NgModule({
    declarations: [PayFeesComponent],

    imports: [PayFeesRoutingModule, ComponentsModule, FeesComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [PayFeesComponent],
})
export class PayFeesModule { }
