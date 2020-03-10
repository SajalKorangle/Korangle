import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'create_grade',
        loadChildren: 'app/modules/grade/pages/create-grade/create-grade.module#CreateGradeModule',
        data: {moduleName: 'grade'},
    },
    {
        path: 'grade_student',
        loadChildren: 'app/modules/grade/pages/grade-student/grade-student.module#GradeStudentModule',
        data: {moduleName: 'grade'},
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
export class GradeRoutingModule { }
