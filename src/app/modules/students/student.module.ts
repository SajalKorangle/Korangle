import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { StudentComponent } from './student.component';

import { AddStudentComponent } from './pages/add-student/add-student.component';
import { ChangeClassComponent } from './pages/change-class/change-class.component';
import { GenerateTcComponent } from './pages/generate-tc/generate-tc.component';
import { PromoteStudentComponent } from './pages/promote-student/promote-student.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { ViewAllComponent } from './pages/view-all/view-all.component';

import {StudentRoutingModule} from './student.routing';

@NgModule({
    declarations: [

        StudentComponent,

        AddStudentComponent,
        ChangeClassComponent,
        GenerateTcComponent,
        PromoteStudentComponent,
        UpdateProfileComponent,
        ViewAllComponent,

    ],

    imports: [

        ComponentsModule,
        StudentRoutingModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [StudentComponent]
})
export class StudentModule { }
