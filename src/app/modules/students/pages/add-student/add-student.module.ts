import { NgModule } from '@angular/core';

import {AddStudentRoutingModule} from './add-student.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {AddStudentComponent} from "./add-student.component";


@NgModule({
    declarations: [
        AddStudentComponent
    ],

    imports: [
        AddStudentRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [AddStudentComponent]
})
export class AddStudentModule { }
