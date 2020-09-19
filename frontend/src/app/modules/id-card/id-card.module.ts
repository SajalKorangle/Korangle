import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { IdCardComponent } from './id-card.component';

import { IdCardRoutingModule } from './id-card.routing';

@NgModule({
    declarations: [
        IdCardComponent,
    ],

    imports: [
        IdCardRoutingModule,
        ComponentsModule
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [IdCardComponent]
})
export class IdCardModule {}
