import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { StudentPermissionComponent } from './student-permission.component';

const routes: Routes = [
    {
        path: '',
        component: StudentPermissionComponent ,
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
export class StudentPermissionRouting { }
