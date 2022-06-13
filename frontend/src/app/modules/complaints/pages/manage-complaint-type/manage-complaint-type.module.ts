import { NgModule } from '@angular/core';

import { ManageComplaintTypeRoutingModule } from './manage-complaint-type.routing';
import { ComponentsModule } from "../../../../components/components.module";
import { ManageComplaintTypeComponent } from "./manage-complaint-type.component";
import { LocalComponentsModule } from '@modules/complaints/component/local-components.module';
import { LocalComponentsModule as LocalComponentsModulee } from '@modules/complaints/pages/manage-complaint-type/component/local-components.module';
import { AddEditStatusModalComponent } from '@modules/complaints/pages/manage-complaint-type/component/add-edit-status-modal/add-edit-status-modal.component';
import { DeleteTableModalComponent } from '@modules/complaints/component/delete-table-modal/delete-table-modal.component';

@NgModule({
    declarations: [ManageComplaintTypeComponent],

    imports: [ManageComplaintTypeRoutingModule, ComponentsModule, LocalComponentsModule, LocalComponentsModulee],
    exports: [],
    providers: [],
    bootstrap: [ManageComplaintTypeComponent],
    entryComponents: [AddEditStatusModalComponent, DeleteTableModalComponent],
})
export class ManageComplaintTypeModule { }
