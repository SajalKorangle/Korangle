import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { SubjectComponent } from './subject.component';

import { SetClassSubjectComponent} from './pages/set-class-subject/set-class-subject.component';
import { SetStudentSubjectComponent } from './pages/set-student-subject/set-student-subject.component';

import { SubjectRoutingModule } from './subject.routing';

import { SubjectService } from '../../services/subject.service';

@NgModule({
    declarations: [

        SubjectComponent,

        SetClassSubjectComponent,
        SetStudentSubjectComponent,

    ],

    imports: [

        ComponentsModule,
        SubjectRoutingModule,

    ],
    exports: [
    ],
    providers: [SubjectService],
    bootstrap: [SubjectComponent],
})
export class SubjectModule { }
