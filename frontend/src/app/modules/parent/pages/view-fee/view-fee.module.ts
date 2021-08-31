import { NgModule } from '@angular/core';

import { ViewFeeRoutingModule } from './view-fee.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { ViewFeeComponent } from './view-fee.component';
import { FeesComponentsModule } from '../../../fees/components/fees-components.module';
import { PaymentResponseDialogComponent } from './components/payment-response-dialog/payment-response-dialog.component';

@NgModule({
    declarations: [ViewFeeComponent, PaymentResponseDialogComponent],

    imports: [ViewFeeRoutingModule, ComponentsModule, FeesComponentsModule],
    exports: [],
    providers: [],
    // Code Review
    // Will the dialog open just after entering the page every time?
    entryComponents: [PaymentResponseDialogComponent],
    bootstrap: [ViewFeeComponent],
})
export class ViewFeeModule { }
