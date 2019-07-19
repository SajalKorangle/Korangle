import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {AddStudentComponent} from "./add-student.component";

const routes: Routes = [
    {
        path: '',
        component: AddStudentComponent ,
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
export class AddStudentRoutingModule { }
