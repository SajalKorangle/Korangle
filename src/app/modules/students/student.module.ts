import { NgModule } from '@angular/core';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComponentsModule } from '../../components/components.module';

import { StudentComponent } from './student.component';

import { AddStudentOldComponent } from './pages/add-student-old/add-student-old.component';
import { AddStudentComponent } from "./pages/add-student/add-student.component";
import { ChangeClassComponent } from './pages/change-class/change-class.component';
import { GenerateTcComponent } from './pages/generate-tc/generate-tc.component';
import { PromoteStudentComponent } from './pages/promote-student/promote-student.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { ViewAllComponent } from './pages/view-all/view-all.component';
import { UploadListComponent } from './pages/upload_list/upload-list.component';
import { ICardsComponent } from './pages/i-cards/i-cards.component';

import {StudentRoutingModule} from './student.routing';
import {UpdateAllComponent} from './pages/update_all/update-all.component';

@NgModule({
    declarations: [

        StudentComponent,

        AddStudentComponent,
        AddStudentOldComponent,
        ChangeClassComponent,
        GenerateTcComponent,
        PromoteStudentComponent,
        UpdateProfileComponent,
        ViewAllComponent,
        UpdateAllComponent,
        UploadListComponent,
        ICardsComponent,

    ],

    imports: [

        ComponentsModule,
        StudentRoutingModule,
        NgxDatatableModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [StudentComponent]
})
export class StudentModule { }
