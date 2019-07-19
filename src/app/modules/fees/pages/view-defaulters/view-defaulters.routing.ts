import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {ViewDefaultersComponent} from "./view-defaulters.component";

const routes: Routes = [
    {
        path: '',
        component: ViewDefaultersComponent ,
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
export class ViewDefaultersRoutingModule { }
