import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AttendanceComponent } from './attendance.component';

const routes: Routes = [
    {
        path: '',
        component: AttendanceComponent,
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
export class AttendanceRoutingModule { }
