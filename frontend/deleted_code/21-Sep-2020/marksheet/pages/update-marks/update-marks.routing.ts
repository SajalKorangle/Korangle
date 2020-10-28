import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {UpdateMarksComponent} from "./update-marks.component";

const routes: Routes = [
    {
        path: '',
        component: UpdateMarksComponent ,
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
export class UpdateMarksRoutingModule { }
