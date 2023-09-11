import { NgModule } from '@angular/core';

import { AddReceiptRoutingModule } from './add-receipt-book.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { AddReceiptBookComponent } from './add-receipt-book.component';

@NgModule({
    declarations: [AddReceiptBookComponent],

    imports: [AddReceiptRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [AddReceiptBookComponent],
})
export class AddReceiptBookModule {}
