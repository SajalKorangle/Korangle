import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { PromoteStudentComponent } from './promote-student.component';

const routes: Routes = [
    {
        path: '',
        component: PromoteStudentComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PromoteStudentRoutingModule {}
