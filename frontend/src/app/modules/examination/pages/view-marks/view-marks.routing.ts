import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ViewMarksComponent } from './view-marks.component';

const routes: Routes = [
    {
        path: '',
        component: ViewMarksComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewMarksRouting {}
