import { NgModule } from '@angular/core';

import { ClassroomComponent } from "./classroom.component";
import { ClassroomRouting } from "./classroom.routing";
import { ComponentsModule } from "@components/components.module";
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
    declarations: [
        ClassroomComponent,
    ],
    imports: [
        ClassroomRouting,
        ComponentsModule,
        MatSnackBarModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ClassroomComponent]
})
export class ClassroomModule { }
