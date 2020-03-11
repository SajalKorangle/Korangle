import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { StudentRemarksComponent } from './student-remarks.component';

const routes: Routes = [
    {
        path: '',
        component: StudentRemarksComponent,
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
export class StudentRemarksRouting { }
