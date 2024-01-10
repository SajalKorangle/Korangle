import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { BacktrackStudentComponent } from './backtrack-student.component';

const routes: Routes = [
    {
        path: '',
        component: BacktrackStudentComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BacktrackStudentRoutingModule {}