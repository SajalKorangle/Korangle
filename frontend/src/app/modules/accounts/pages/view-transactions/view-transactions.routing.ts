import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ViewTransactionsComponent } from './view-transactions.component';

const routes: Routes = [
    {
        path: '',
        component: ViewTransactionsComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewTransactionsRoutingModule {}
