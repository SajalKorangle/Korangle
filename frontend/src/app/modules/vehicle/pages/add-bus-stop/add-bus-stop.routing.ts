import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AddBusStopComponent } from './add-bus-stop.component';

const routes: Routes = [
    {
        path: '',
        component: AddBusStopComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AddBusStopRoutingModule {}
