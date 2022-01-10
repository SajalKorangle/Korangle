import { NgModule } from '@angular/core';

import { ManageComplaintTypesRoutingModule } from './manage-complaint-types.routing';
import { ComponentsModule } from "../../../../components/components.module";
import { ManageComplaintTypesComponent } from "./manage-complaint-types.component";
import { LocalComponentsModule } from '@modules/parent-support/component/local-components.module';
import { AddStatusModalComponent } from '@modules/parent-support/component/add-status-modal/add-status-modal.component';

@NgModule({
    declarations: [ManageComplaintTypesComponent],

    imports: [ManageComplaintTypesRoutingModule, ComponentsModule, LocalComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [ManageComplaintTypesComponent],
    entryComponents: [AddStatusModalComponent],
})
export class ManageComplaintTypesModule { }
