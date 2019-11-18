import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AssignClassComponent } from './assign-class.component';

const routes: Routes = [
    {
        path: '',
        component: AssignClassComponent ,
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
export class AssignClassRoutingModule { }
