import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { TrackEmployeeActivityComponent } from './track-employee-activity.component';

const routes: Routes = [
    {
        path: '',
        component: TrackEmployeeActivityComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TrackEmployeeActivityRoutingModule {}
