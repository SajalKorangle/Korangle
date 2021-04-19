import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { RecordAttendanceComponent } from './record-attendance.component';

const routes: Routes = [
    {
        path: '',
        component: RecordAttendanceComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RecordAttendanceRoutingModule {}
