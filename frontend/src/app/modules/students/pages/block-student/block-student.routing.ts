import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { BlockStudentComponent } from './block-student.component';

const routes: Routes = [
    {
        path: '',
        component: BlockStudentComponent ,
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
export class BlockStudentRouting { }

