import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {GeneratePatrakComponent} from "./generate-patrak.component";

const routes: Routes = [
    {
        path: '',
        component: GeneratePatrakComponent ,
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
export class GeneratePatrakRoutingModule { }
