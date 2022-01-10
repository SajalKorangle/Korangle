import { NgModule } from '@angular/core';

import { AddComplaintRoutingModule } from './add-complaint.routing';
import { ComponentsModule } from "../../../../components/components.module";
import { AddComplaintComponent } from "./add-complaint.component";

@NgModule({
    declarations: [AddComplaintComponent],

    imports: [AddComplaintRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [AddComplaintComponent],
})
export class AddComplaintModule { }
