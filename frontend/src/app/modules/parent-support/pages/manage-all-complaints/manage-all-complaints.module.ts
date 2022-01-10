import { NgModule } from '@angular/core';

import { ManageAllComplaintsRoutingModule } from './manage-all-complaints.routing';
import { ComponentsModule } from "../../../../components/components.module";
import { ManageAllComplaintsComponent } from "./manage-all-complaints.component";

@NgModule({
    declarations: [ManageAllComplaintsComponent],

    imports: [ManageAllComplaintsRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [ManageAllComplaintsComponent],
})
export class ManageAllComplaintsModule { }
