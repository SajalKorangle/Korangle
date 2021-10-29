import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { PayFeesComponent } from './pay-fees.component';

const routes: Routes = [
    {
        path: '',
        component: PayFeesComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PayFeesRoutingModule { }
