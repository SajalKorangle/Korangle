import { NgModule } from '@angular/core';

import { TotalDiscountRoutingModule } from './total-discount.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { TotalDiscountComponent } from './total-discount.component';
import { FeesComponentsModule } from '../../components/fees-components.module';

@NgModule({
    declarations: [TotalDiscountComponent],

    imports: [TotalDiscountRoutingModule, ComponentsModule, FeesComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [TotalDiscountComponent],
})
export class TotalDiscountModule {}
