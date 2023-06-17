import { NgModule } from "@angular/core";
import { ManagePlanComponent } from "./manage_plan.component";
import { ManagePlanRouting } from "./manage_plan.routing";
import { ComponentsModule } from "@components/components.module";
import { MatGridListModule } from "@angular/material/grid-list";
@NgModule({
    declarations: [ManagePlanComponent],
    imports: [ManagePlanRouting, ComponentsModule, MatGridListModule],
    exports: [MatGridListModule],
    bootstrap: [ManagePlanComponent],
})
export class ManagePlanModule {}
