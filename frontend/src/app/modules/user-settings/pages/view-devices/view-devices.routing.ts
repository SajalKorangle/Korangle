import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ViewDevicesComponent } from './view-devices.component';

const routes: Routes = [
    {
        path: '',
        component: ViewDevicesComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewDevicesRoutingModule {}
