import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'create_grade',
        loadChildren: 'app/modules/grade/pages/create-grade/create-grade.module#CreateGradeModule',
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
