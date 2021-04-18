import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {CancelTCComponent} from "./cancel-tc.component";

const routes: Routes = [
    {
        path: '',
        component: CancelTCComponent ,
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
export class CancleTCRoutingModule { }
