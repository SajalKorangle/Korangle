import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ViewBookFlowComponent } from './view-book-flow.component';

const routes: Routes = [
    {
        path: '',
        component: ViewBookFlowComponent,
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
export class ViewBookFlowRouting { }