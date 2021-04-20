import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ViewAttendanceComponent } from './view-attendance.component';

const routes: Routes = [
    {
        path: '',
        component: ViewAttendanceComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewAttendanceRoutingModule {}
