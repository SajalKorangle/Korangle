import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ExperienceCertiComponent } from './experience-certi.component';

const routes: Routes = [
    {
        path: '',
        component: ExperienceCertiComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ExperienceCertiRoutingModule {}
