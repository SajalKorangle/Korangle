import { NgModule } from '@angular/core';

import { ViewFeeRoutingModule } from './view-fee.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { ViewFeeComponent } from './view-fee.component';
import { FeesComponentsModule } from '../../../fees/components/fees-components.module';
import { PaymentDailogComponent } from './components/payment-dailog/payment-dailog.component';
import { PaymentResponseDialogComponent } from './components/payment-response-dialog/payment-response-dialog.component';

@NgModule({
    declarations: [ViewFeeComponent, PaymentResponseDialogComponent],

    imports: [ViewFeeRoutingModule, ComponentsModule, FeesComponentsModule],
    exports: [],
    providers: [],
    entryComponents: [PaymentResponseDialogComponent],
    bootstrap: [ViewFeeComponent],
})
export class ViewFeeModule { }
