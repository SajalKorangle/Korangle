import { NgModule } from '@angular/core';

import { ManageComplaintTypeRoutingModule } from './manage-complaint-type.routing';
import { ComponentsModule } from "../../../../components/components.module";
import { ManageComplaintTypeComponent } from "./manage-complaint-type.component";
import { LocalComponentsModule } from '@modules/parent-support/component/local-components.module';
import { LocalComponentsModule as LocalComponentsModulee } from '@modules/parent-support/pages/manage-complaint-type/component/local-components.module';
import { AddStatusModalComponent } from '@modules/parent-support/pages/manage-complaint-type/component/add-status-modal/add-status-modal.component';
import { DeleteTableModalComponent } from '@modules/parent-support/component/delete-table-modal/delete-table-modal.component';

@NgModule({
    declarations: [ManageComplaintTypeComponent],

    imports: [ManageComplaintTypeRoutingModule, ComponentsModule, LocalComponentsModule, LocalComponentsModulee],
    exports: [],
    providers: [],
    bootstrap: [ManageComplaintTypeComponent],
    entryComponents: [AddStatusModalComponent, DeleteTableModalComponent],
})
export class ManageComplaintTypeModule { }
