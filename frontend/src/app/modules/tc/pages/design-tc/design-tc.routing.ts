import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DesignTCComponent } from './design-tc.component';

const routes: Routes = [
    {
        path: '',
        component: DesignTCComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DesignTCRoutingModule {}
