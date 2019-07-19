import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { VehicleComponent } from './vehicle.component';

import { AddBusStopComponent } from './pages/add-bus-stop/add-bus-stop.component';
import { DeleteBusStopComponent } from './pages/delete-bus-stop/delete-bus-stop.component';
import { UpdateBusStopComponent } from './pages/update-bus-stop/update-bus-stop.component';

import { VehicleRoutingModule } from './vehicle.routing';

import { VehicleService } from './vehicle.service';

@NgModule({
    declarations: [

        VehicleComponent,

        // AddBusStopComponent,
        // DeleteBusStopComponent,
        // UpdateBusStopComponent,

    ],

    imports: [

        ComponentsModule,
        VehicleRoutingModule,

    ],
    exports: [
    ],
    providers: [VehicleService],
    bootstrap: [VehicleComponent]
})
export class VehicleModule { }
