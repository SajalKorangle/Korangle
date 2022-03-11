import { NgModule } from '@angular/core';

import { ManageComplaintsRoutingModule } from './manage-complaints.routing';
import { ComponentsModule } from "../../../../components/components.module";
import { ManageComplaintsComponent } from "./manage-complaints.component";
import { LocalComponentsModule } from '@modules/parent-support/component/local-components.module';
import { LocalComponentsModule as LocalComponentsModulee } from '@modules/parent-support/pages/manage-complaints/component/local-components.module';
import { AssignEmployeeComponent } from '@modules/parent-support/pages/manage-complaints/component/assign-employee/assign-employee.component';
import { DeleteTableModalComponent } from '@modules/parent-support/component/delete-table-modal/delete-table-modal.component';

@NgModule({
    declarations: [ManageComplaintsComponent],

    imports: [ManageComplaintsRoutingModule, ComponentsModule, LocalComponentsModule, LocalComponentsModulee],
    exports: [],
    providers: [],
    bootstrap: [ManageComplaintsComponent],
    entryComponents: [AssignEmployeeComponent, DeleteTableModalComponent],
})
export class ManageComplaintsModule { }
