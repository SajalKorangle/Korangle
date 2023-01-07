import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { RemoveDuplicateMarksComponent } from './remove-duplicate-marks.component';

const routes: Routes = [
    {
        path: '',
        component: RemoveDuplicateMarksComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RemoveDuplicateMarksRouting {}
