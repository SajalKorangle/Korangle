import { NgModule } from '@angular/core';

import { AddFeeTypeRoutingModule } from './add-fee-type.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { AddFeeTypeComponent } from './add-fee-type.component';

@NgModule({
    declarations: [AddFeeTypeComponent],

    imports: [AddFeeTypeRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [AddFeeTypeComponent],
})
export class AddFeeTypeModule {}
