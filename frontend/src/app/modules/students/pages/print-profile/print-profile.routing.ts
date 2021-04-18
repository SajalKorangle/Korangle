import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { PrintProfileComponent } from './print-profile.component';

const routes: Routes = [
    {
        path: '',
        component: PrintProfileComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PrintProfileRoutingModule {}
