import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {GradeStudentFieldsComponent} from "./grade-student-fields.component";

const routes: Routes = [
    {
        path: '',
        component: GradeStudentFieldsComponent ,
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
export class GradeStudentFieldsRoutingModule { }
