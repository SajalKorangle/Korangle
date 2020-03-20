import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {ViewGradesRemarksComponent} from "./view-grades-remarks.component";

const routes: Routes = [
    {
        path: '',
        component: ViewGradesRemarksComponent ,
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
export class ViewGradesRemarksRouting { }
