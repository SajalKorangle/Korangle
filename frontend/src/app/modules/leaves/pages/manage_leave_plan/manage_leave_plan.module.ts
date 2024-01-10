import { NgModule } from "@angular/core";
import { ManageLeavePlanComponent } from "./manage_leave_plan.component";
import { ManageLeavePlanRouting } from "./manage_leave_plan.routing";
import { ComponentsModule } from "@components/components.module";
import { MatGridListModule } from "@angular/material/grid-list";
@NgModule({
    declarations: [ManageLeavePlanComponent],
    imports: [ManageLeavePlanRouting, ComponentsModule, MatGridListModule],
    exports: [MatGridListModule],
    bootstrap: [ManageLeavePlanComponent],
})
export class ManageLeavePlanModule {}
