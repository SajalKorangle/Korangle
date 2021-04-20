import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SubjectComponent } from './subject.component';

const routes: Routes = [
    {
        path: 'set_class_subject',
        loadChildren: 'app/modules/subject/pages/set-class-subject/set-class-subject.module#SetClassSubjectModule',
        data: { moduleName: 'subject' },
    },
    {
        path: 'set_student_subject',
        loadChildren: 'app/modules/subject/pages/set-student-subject/set-student-subject.module#SetStudentSubjectModule',
        data: { moduleName: 'subject' },
    },

    {
        path: '',
        component: SubjectComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SubjectRoutingModule {}
