import { NgModule } from "@angular/core";

import { ManageTypeComponent } from "./manage_type.component";
import { ManageTypeRouting } from "./manage_type.routing";
import { ComponentsModule } from "@components/components.module";
import { LeaveTypeDialog } from "@modules/leaves/components/dialogs/leave-type-dialog/leave-type.component";
@NgModule({
    declarations: [ManageTypeComponent, LeaveTypeDialog],
    imports: [ManageTypeRouting, ComponentsModule],
    bootstrap: [ManageTypeComponent],
})
export class ManageTypeModule {}