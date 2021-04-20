import { NgModule } from '@angular/core';

import { TCLogbookRoutingModule } from './tc-logbook.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { TCLogbookComponent } from './tc-logbook.component';

@NgModule({
    declarations: [TCLogbookComponent],

    imports: [TCLogbookRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [TCLogbookComponent],
})
export class TCLogbookModule {}
