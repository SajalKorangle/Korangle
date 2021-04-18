import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ExpenseListComponent } from './expense-list.component';

const routes: Routes = [
    {
        path: '',
        component: ExpenseListComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ExpenseListRoutingModule {}
