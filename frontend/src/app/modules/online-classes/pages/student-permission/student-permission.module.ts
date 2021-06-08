import { NgModule } from '@angular/core';

import { StudentPermissionComponent } from "./student-permission.component";
import { StudentPermissionRouting } from "./student-permission.routing";
import {ComponentsModule} from "@components/components.module";

@NgModule({
    declarations: [
        StudentPermissionComponent,
    ],
    imports: [
        StudentPermissionRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ StudentPermissionComponent ]
})
export class StudentPermissionModule { }
