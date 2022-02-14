import { NgModule } from '@angular/core';

import { ManageAllComplaintsRoutingModule } from './manage-all-complaints.routing';
import { ComponentsModule } from "../../../../components/components.module";
import { ManageAllComplaintsComponent } from "./manage-all-complaints.component";
import { LocalComponentsModule } from '@modules/parent-support/component/local-components.module';
import { AssignEmployeeComponent } from '@modules/parent-support/component/assign-employee/assign-employee.component';
import { DeleteTableModalComponent } from '@modules/parent-support/component/delete-table-modal/delete-table-modal.component';

@NgModule({
    declarations: [ManageAllComplaintsComponent],

    imports: [ManageAllComplaintsRoutingModule, ComponentsModule, LocalComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [ManageAllComplaintsComponent],
    entryComponents: [AssignEmployeeComponent, DeleteTableModalComponent],
})
export class ManageAllComplaintsModule { }
