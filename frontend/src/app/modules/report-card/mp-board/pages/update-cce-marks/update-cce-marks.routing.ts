import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { UpdateCceMarksComponent } from './update-cce-marks.component';

const routes: Routes = [
    {
        path: '',
        component: UpdateCceMarksComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UpdateCceMarksoutingModule {}
