import { NgModule } from '@angular/core';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ICardsRoutingModule } from './i-cards.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { ICardsComponent } from './i-cards.component';

@NgModule({
    declarations: [ICardsComponent],

    imports: [ICardsRoutingModule, ComponentsModule, NgxDatatableModule],
    exports: [],
    providers: [],
    bootstrap: [ICardsComponent],
})
export class ICardsModule {}
