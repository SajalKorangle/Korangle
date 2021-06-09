import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DesignLayoutComponent } from './design-layout.component';

const routes: Routes = [
    {
        path: '',
        component: DesignLayoutComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DesignLayoutRoutingModule {}
