import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {CreateSchoolComponent} from "./create-school.component";

const routes: Routes = [
    {
        path: '',
        component: CreateSchoolComponent ,
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
export class CreateSchoolRoutingModule { }
