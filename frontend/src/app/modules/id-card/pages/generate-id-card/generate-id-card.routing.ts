import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { GenerateIdCardComponent } from './generate-id-card.component';

const routes: Routes = [
    {
        path: '',
        component: GenerateIdCardComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GenerateIdCardRoutingModule {}
