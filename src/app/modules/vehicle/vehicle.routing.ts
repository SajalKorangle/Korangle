import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { VehicleComponent } from './vehicle.component';

const routes: Routes = [
    {
        path: '',
        component: VehicleComponent,
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule,
    ],
})
export class VehicleRoutingModule { }
