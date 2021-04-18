import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AssignTaskComponent } from './assign-task.component';

const routes: Routes = [
    {
        path: '',
        component: AssignTaskComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AssignTaskRoutingModule {}
