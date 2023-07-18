import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'track_employee_activity',
        loadChildren: 'app/modules/activity/pages/track-employee-activity/track-employee-activity.module#TrackEmployeeActivityModule',
        data: { moduleName: 'activity' },
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ActivityRoutingModule {}
