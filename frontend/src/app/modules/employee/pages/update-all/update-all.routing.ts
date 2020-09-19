import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {UpdateAllComponent} from './update-all.component';

const routes: Routes = [
    {
        path: '',
        component: UpdateAllComponent ,
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
export class UpdateAllRoutingModule { }
