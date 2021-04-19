import { NgModule } from '@angular/core';

import { ViewPurchasesRoutingModule } from './view-purchases.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { ViewPurchasesComponent } from './view-purchases.component';

@NgModule({
    declarations: [ViewPurchasesComponent],

    imports: [ViewPurchasesRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [ViewPurchasesComponent],
})
export class ViewPurchasesModule {}
