import { NgModule } from '@angular/core';


import { AddStudentRemarksRouting } from './add-student-remarks.routing';
import {ComponentsModule} from "../../../../../components/components.module";
import {AddStudentRemarksComponent} from "./add-student-remarks.component";


@NgModule({
    declarations: [
        AddStudentRemarksComponent
    ],

    imports: [
        AddStudentRemarksRouting ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [AddStudentRemarksComponent]
})
export class AddStudentRemarksModule { }
