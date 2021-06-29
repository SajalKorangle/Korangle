import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { CreateGradeComponent } from './create-grade.component';

const routes: Routes = [
    {
        path: '',
        component: CreateGradeComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CreateGradeRouting {}
