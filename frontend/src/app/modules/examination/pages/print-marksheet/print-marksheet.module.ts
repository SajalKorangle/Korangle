import { NgModule } from '@angular/core';

import { PrintMarksheetRoutingModule } from './print-marksheet.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { PrintMarksheetComponent } from './print-marksheet.component';

@NgModule({
    declarations: [PrintMarksheetComponent],

    imports: [PrintMarksheetRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [PrintMarksheetComponent],
})
export class PrintMarksheetModule {}
