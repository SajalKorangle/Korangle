import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DeleteStudentComponent } from './delete-student.component';

const routes: Routes = [
    {
        path: '',
        component: DeleteStudentComponent,
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
export class DeleteStudentRoutingModule { }
