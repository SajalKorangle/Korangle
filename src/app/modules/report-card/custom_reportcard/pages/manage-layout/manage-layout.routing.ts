import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {ManageLayoutComponent} from "./manage-layout.component";

const routes: Routes = [
    {
        path: '',
        component: ManageLayoutComponent,
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
export class ManageLayoutRouting { }
