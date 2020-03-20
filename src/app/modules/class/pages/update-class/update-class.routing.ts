import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {UpdateClassComponent} from "./update-class.component";

const routes: Routes = [
    {
        path: '',
        component: UpdateClassComponent ,
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
export class UpdateClassRoutingModule { }
