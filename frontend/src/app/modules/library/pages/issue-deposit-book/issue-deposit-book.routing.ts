import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IssueDepositBookComponent } from './issue-deposit-book.component';

const routes: Routes = [
    {
        path: '',
        component: IssueDepositBookComponent,
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
export class IssueDepositBookRouting { }