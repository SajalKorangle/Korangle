import { NgModule } from '@angular/core';

import { ManageComplaintsComponent } from "./manage-complaints.component";
import { ManageComplaintsRouting } from "./manage-complaints.routing";
import { ComponentsModule } from "@components/components.module";

@NgModule({
    declarations: [
        ManageComplaintsComponent,
    ],
    imports: [
        ManageComplaintsRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ ManageComplaintsComponent ]
})
export class ManageComplaintsModule { }
