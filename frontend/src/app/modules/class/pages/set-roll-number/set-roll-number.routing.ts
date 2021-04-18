import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SetRollNumberComponent } from './set-roll-number.component';

const routes: Routes = [
    {
        path: '',
        component: SetRollNumberComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SetRollNumberRoutingModule {}
