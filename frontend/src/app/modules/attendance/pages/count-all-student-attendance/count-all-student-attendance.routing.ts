import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { CountAllStudentAttendanceComponent } from './count-all-student-attendance.component';

const routes: Routes = [
    {
        path: '',
        component: CountAllStudentAttendanceComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CountAllStudentAttendanceRoutingModule {}
