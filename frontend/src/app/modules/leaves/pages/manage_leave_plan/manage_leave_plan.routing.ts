import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ManageLeavePlanComponent } from "./manage_leave_plan.component";

const routes: Routes = [
    {
        path: "",
        component: ManageLeavePlanComponent,
    },
];
@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ManageLeavePlanRouting {}
