import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {UpdateStudentFeesComponent} from "./update-student-fees.component";

const routes: Routes = [
    {
        path: '',
        component: UpdateStudentFeesComponent ,
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
export class UpdateStudentFeesRoutingModule { }
