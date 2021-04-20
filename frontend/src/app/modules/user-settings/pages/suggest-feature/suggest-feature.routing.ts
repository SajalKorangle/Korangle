import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SuggestFeatureComponent } from './suggest-feature.component';

const routes: Routes = [
    {
        path: '',
        component: SuggestFeatureComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SuggestFeatureRouting {}
