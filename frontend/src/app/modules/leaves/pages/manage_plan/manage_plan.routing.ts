import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ManagePlanComponent } from "./manage_plan.component";

const routes: Routes = [
    {
        path: "",
        component: ManagePlanComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ManagePlanRouting {}
