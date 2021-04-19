import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { UpdateBusStopComponent } from './update-bus-stop.component';

const routes: Routes = [
    {
        path: '',
        component: UpdateBusStopComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UpdateBusStopRoutingModule {}
