import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';
import { ComplaintsComponent } from './complaints.component';
import { ComplaintsRoutingModule } from './complaints.routing';
import { PrintCountAllTableComplaintsComponent } from './print/print-count-all-table-complaints/print-count-all-table-complaints.component';

@NgModule({
    declarations: [
        ComplaintsComponent,
        PrintCountAllTableComplaintsComponent,
    ],

    imports: [ComponentsModule, ComplaintsRoutingModule],
    exports: [],
    entryComponents: [],
    providers: [],
    bootstrap: [ComplaintsComponent],
})
export class ComplaintsModule { }
