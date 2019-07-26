import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {UpdateProfileComponent} from "./update-profile.component";

const routes: Routes = [
    {
        path: '',
        component: UpdateProfileComponent ,
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
export class UpdateProfileRoutingModule { }
