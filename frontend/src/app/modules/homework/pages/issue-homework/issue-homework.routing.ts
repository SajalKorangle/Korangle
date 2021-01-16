import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IssueHomeworkComponent } from './issue-homework.component';

const routes: Routes = [
    {
        path: '',
        component: IssueHomeworkComponent ,
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
export class IssueHomeworkRoutingModule { }
