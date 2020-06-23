import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {ManageLayoutsComponent} from "./manage-layouts.component";

const routes: Routes = [
    {
        path: '',
        component: ManageLayoutsComponent ,
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
export class ManageLayoutsRoutingModule { }