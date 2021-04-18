import { NgModule } from '@angular/core';

import { RecordPaymentRoutingModule } from './record-payment.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { RecordPaymentComponent } from './record-payment.component';

@NgModule({
    declarations: [RecordPaymentComponent],

    imports: [RecordPaymentRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [RecordPaymentComponent],
})
export class RecordPaymentModule {}
