import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ViewStudentRemarksComponent } from './view-student-remarks.component';

const routes: Routes = [
    {
        path: '',
        component: ViewStudentRemarksComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewStudentRemarksRouting {}
