import { NgModule } from "@angular/core";
import { ComponentsModule } from "../../components/components.module";
import { LeavesComponent } from "./leaves.component";
import { LeavesRoutingModule } from "./leaves.routing";

@NgModule({
    declarations: [LeavesComponent],

    imports: [ComponentsModule, LeavesRoutingModule],
    exports: [],
    providers: [],
    bootstrap: [LeavesComponent],
})
export class LeavesModule {}
