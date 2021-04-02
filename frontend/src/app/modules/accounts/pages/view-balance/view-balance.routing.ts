import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ViewBalanceComponent } from './view-balance.component';

const routes: Routes = [
    {
        path: '',
        component: ViewBalanceComponent ,
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
export class ViewBalanceRoutingModule { }
