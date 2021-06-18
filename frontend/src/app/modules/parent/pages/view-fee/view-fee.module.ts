import { NgModule } from '@angular/core';

import { ViewFeeRoutingModule } from './view-fee.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { ViewFeeComponent } from './view-fee.component';
import { FeesComponentsModule } from '../../../fees/components/fees-components.module';
import { PaymentDailogComponent } from './components/payment-dailog/payment-dailog.component';

@NgModule({
    declarations: [ViewFeeComponent, PaymentDailogComponent],

    imports: [ViewFeeRoutingModule, ComponentsModule, FeesComponentsModule],
    exports: [],
    providers: [],
    entryComponents: [PaymentDailogComponent],
    bootstrap: [ViewFeeComponent],
})
export class ViewFeeModule { }
