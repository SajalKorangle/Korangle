import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SetStudentSubjectComponent } from './set-student-subject.component';

const routes: Routes = [
    {
        path: '',
        component: SetStudentSubjectComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SetStudentSubjectRoutingModule {}
