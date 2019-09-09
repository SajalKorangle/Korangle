import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {GenerateGoshwaraComponent} from "./generate-goshwara.component";

const routes: Routes = [
    {
        path: '',
        component: GenerateGoshwaraComponent ,
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
export class GenerateGoshwaraRoutingModule { }
