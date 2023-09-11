import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AddReceiptBookComponent } from './add-receipt-book.component';

const routes: Routes = [
    {
        path: '',
        component: AddReceiptBookComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AddReceiptRoutingModule {}
