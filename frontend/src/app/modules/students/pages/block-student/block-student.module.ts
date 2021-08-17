import { NgModule } from '@angular/core';

import { BlockStudentComponent } from "./block-student.component";
import { BlockStudentRouting } from "./block-student.routing";
import {ComponentsModule} from "@components/components.module";

@NgModule({
    declarations: [
        BlockStudentComponent,
    ],
    imports: [
        BlockStudentRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ BlockStudentComponent ]
})
export class BlockStudentModule { }
