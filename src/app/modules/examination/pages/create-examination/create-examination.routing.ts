import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {CreateExaminationComponent} from "./create-examination.component";

const routes: Routes = [
    {
        path: '',
        component: CreateExaminationComponent ,
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
export class CreateExaminationtRoutingModule { }
