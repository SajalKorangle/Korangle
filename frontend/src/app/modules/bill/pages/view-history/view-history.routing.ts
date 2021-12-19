import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ViewHistoryComponent } from './view-history.component';

const routes: Routes = [
    {
        path: '',
        component: ViewHistoryComponent ,
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
export class ViewHistoryRoutingModule { }
