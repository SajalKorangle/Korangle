import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {ManageParameterComponent} from "./manage-parameter.component";

const routes: Routes = [
    {
        path: '',
        component: ManageParameterComponent ,
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
export class ManageParameterRouting { }
