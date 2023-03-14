import { NgModule } from "@angular/core";
import { ManagePlanComponent } from "./manage_plan.component";
import { ManagePlanRouting } from "./manage_plan.routing";
import { ComponentsModule } from "@components/components.module";
@NgModule({
    declarations: [ManagePlanComponent],
    imports: [ManagePlanRouting, ComponentsModule],
    bootstrap: [ManagePlanComponent],
})
export class ManagePlanModule {}
