import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { UpdateTransactionComponent } from './update-transaction.component';

const routes: Routes = [
    {
        path: '',
        component: UpdateTransactionComponent ,
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
export class UpdateTransactionRoutingModule { }
