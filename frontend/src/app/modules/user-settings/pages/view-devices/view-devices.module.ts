import { NgModule } from '@angular/core';

import { ViewDevicesRoutingModule } from './view-devices.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { ViewDevicesComponent } from './view-devices.component';

@NgModule({
    declarations: [ViewDevicesComponent],

    imports: [ViewDevicesRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [ViewDevicesComponent],
})
export class ViewDevicesModule {}
