import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ManageMyComplaintsComponent } from "./manage-my-complaints.component";

const routes: Routes = [
    {
        path: '',
        component: ManageMyComplaintsComponent ,
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
export class ManageMyComplaintsRouting { }
