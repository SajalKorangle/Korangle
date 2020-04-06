import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AddExpenseComponent } from './add-expense.component';

const routes: Routes = [
    {
        path: '',
        component: AddExpenseComponent,
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule,
    ],
})
export class AddExpenseRoutingModule { }
