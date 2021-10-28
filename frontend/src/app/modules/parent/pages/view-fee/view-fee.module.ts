import { NgModule } from '@angular/core';

import { ViewFeeRoutingModule } from './view-fee.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { ViewFeeComponent } from './view-fee.component';
import { FeesComponentsModule } from '../../../fees/components/fees-components.module';

@NgModule({
    declarations: [ViewFeeComponent],

    imports: [ViewFeeRoutingModule, ComponentsModule, FeesComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [ViewFeeComponent],
})
export class ViewFeeModule { }
