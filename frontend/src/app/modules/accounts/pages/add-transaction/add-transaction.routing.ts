import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AddTransactionComponent } from './add-transaction.component';

const routes: Routes = [
    {
        path: '',
        component: AddTransactionComponent ,
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
export class AddTransactionRoutingModule { }
