import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {RegenerateTCComponent} from "./regenerate-tc.component";

const routes: Routes = [
    {
        path: '',
        component: RegenerateTCComponent,
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
export class RegenerateTCRoutingModule { }
