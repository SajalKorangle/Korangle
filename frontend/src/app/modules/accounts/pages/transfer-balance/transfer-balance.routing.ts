import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { TransferBalanceComponent } from './transfer-balance.component';

const routes: Routes = [
    {
        path: '',
        component: TransferBalanceComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TransferBalanceRoutingModule {}
