import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { VehicleComponent } from './vehicle.component';

const routes: Routes = [
    {
        path: 'update_bus_stop',
        loadChildren: 'app/modules/vehicle/pages/update-bus-stop/update-bus-stop.module#UpdateBusStopModule',
        data: { moduleName: 'vehicle' },
    },
    {
        path: 'add_bus_stop',
        loadChildren: 'app/modules/vehicle/pages/add-bus-stop/add-bus-stop.module#AddBusStopModule',
        data: { moduleName: 'vehicle' },
    },
    {
        path: 'delete_bus_stop',
        loadChildren: 'app/modules/vehicle/pages/delete-bus-stop/delete-bus-stop.module#DeleteBusStopModule',
        data: { moduleName: 'vehicle' },
    },

    {
        path: '',
        component: VehicleComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class VehicleRoutingModule {}
