import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ViewGradeComponent } from './view-grade.component';

const routes: Routes = [
    {
        path: '',
        component: ViewGradeComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewGradeRouting {}
