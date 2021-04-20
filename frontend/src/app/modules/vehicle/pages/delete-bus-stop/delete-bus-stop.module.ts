import { NgModule } from '@angular/core';

import { DeleteBusStopRoutingModule } from './delete-bus-stop.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { DeleteBusStopComponent } from './delete-bus-stop.component';

@NgModule({
    declarations: [DeleteBusStopComponent],

    imports: [DeleteBusStopRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [DeleteBusStopComponent],
})
export class DeleteBusStopModule {}
