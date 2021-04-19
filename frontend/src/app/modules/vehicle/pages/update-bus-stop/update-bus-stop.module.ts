import { NgModule } from '@angular/core';

import { UpdateBusStopRoutingModule } from './update-bus-stop.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { UpdateBusStopComponent } from './update-bus-stop.component';

@NgModule({
    declarations: [UpdateBusStopComponent],

    imports: [UpdateBusStopRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [UpdateBusStopComponent],
})
export class UpdateBusStopModule {}
