import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { LockFeesComponent } from './lock-fees.component';

const routes: Routes = [
    {
        path: '',
        component: LockFeesComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LockFeesRoutingModule {}
