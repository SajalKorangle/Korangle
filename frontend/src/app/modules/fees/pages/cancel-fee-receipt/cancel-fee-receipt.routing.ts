import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { CancelFeeReceiptComponent } from './cancel-fee-receipt.component';

const routes: Routes = [
    {
        path: '',
        component: CancelFeeReceiptComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CancelFeeReceiptRoutingModule {}
