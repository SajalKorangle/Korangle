import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DemoteStudentComponent } from './demote-student.component';

const routes: Routes = [
    {
        path: '',
        component: DemoteStudentComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DemoteStudentRoutingModule {}
