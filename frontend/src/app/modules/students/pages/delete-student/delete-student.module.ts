import { NgModule } from '@angular/core';

import { ComponentsModule } from "../../../../components/components.module";
import { DeleteStudentComponent } from './delete-student.component';
import { DeleteStudentRoutingModule } from './delete-student.routing';


@NgModule({
    declarations: [
        DeleteStudentComponent
    ],

    imports: [
        DeleteStudentRoutingModule,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [DeleteStudentComponent]
})
export class DeleteStudentModule { }
