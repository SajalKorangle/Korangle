import { NgModule } from '@angular/core';

import { ManageMyComplaintsComponent } from "./manage-my-complaints.component";
import { ManageMyComplaintsRouting } from "./manage-my-complaints.routing";
import { ComponentsModule } from "@components/components.module";

@NgModule({
    declarations: [
        ManageMyComplaintsComponent,
    ],
    imports: [
        ManageMyComplaintsRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ ManageMyComplaintsComponent ]
})
export class ManageMyComplaintsModule { }
