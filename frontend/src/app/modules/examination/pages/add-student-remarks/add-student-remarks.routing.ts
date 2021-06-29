import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AddStudentRemarksComponent } from './add-student-remarks.component';

const routes: Routes = [
    {
        path: '',
        component: AddStudentRemarksComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AddStudentRemarksRouting {}
