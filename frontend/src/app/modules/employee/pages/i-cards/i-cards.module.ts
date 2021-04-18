import { NgModule } from '@angular/core';

import { ICardsComponent } from './i-cards.component';

import { ICardsRoutingModule } from './i-cards.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
    declarations: [ICardsComponent],

    imports: [ICardsRoutingModule, ComponentsModule, NgxDatatableModule],
    exports: [],
    providers: [],
    bootstrap: [ICardsComponent],
})
export class ICardsModule {}
