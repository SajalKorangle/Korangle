import { NgModule } from '@angular/core';

import { ManageTypeComponent } from "./manage_type.component";
import { ManageTypeRouting } from "./manage_type.routing";
import {ComponentsModule} from "@components/components.module";

@NgModule({
    declarations: [
        ManageTypeComponent,
    ],
    imports: [
        ManageTypeRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ ManageTypeComponent ]
})
export class ManageTypeModule { }
