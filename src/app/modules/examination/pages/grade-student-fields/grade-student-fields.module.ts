import { NgModule } from '@angular/core';


import {GradeStudentFieldsRoutingModule, } from './grade-student-fields.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {GradeStudentFieldsComponent} from "./grade-student-fields.component";


@NgModule({
    declarations: [
        GradeStudentFieldsComponent
    ],

    imports: [
        GradeStudentFieldsRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [GradeStudentFieldsComponent]
})
export class GradeStudentFieldsModule { }
