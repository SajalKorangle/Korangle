import { NgModule } from '@angular/core';

import { ClassroomComponent } from "./classroom.component";
import { ClassroomRouting } from "./classroom.routing";
import { ComponentsModule } from "@components/components.module";

@NgModule({
    declarations: [
        ClassroomComponent,
    ],
    imports: [
        ClassroomRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ClassroomComponent]
})
export class ClassroomModule { }
