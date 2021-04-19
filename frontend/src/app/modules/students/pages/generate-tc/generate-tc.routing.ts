import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { GenerateTcComponent } from './generate-tc.component';

const routes: Routes = [
    {
        path: '',
        component: GenerateTcComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GenerateTcRoutingModule {}
