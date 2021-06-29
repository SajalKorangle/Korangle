import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { GradeStudentComponent } from './grade-student.component';

const routes: Routes = [
    {
        path: '',
        component: GradeStudentComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GradeStudentRouting {}
