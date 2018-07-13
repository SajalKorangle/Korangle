import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ParentComponent } from './parent.component';

const routes: Routes = [
    {
        path: '',
        component: ParentComponent,
    },
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
export class ParentRoutingModule { }
