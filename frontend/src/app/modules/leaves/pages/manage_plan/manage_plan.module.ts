import { NgModule, Component } from "@angular/core";
import { ComponentsModule } from "@components/components.module";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

@Component({
    selector: "manage-plan",
    template: "Under Construction!",
})
export class ManagePlanComponent {}

const routes: Routes = [
    {
        path: "",
        component: ManagePlanComponent
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ManagePlanRouting {}

@NgModule({
    declarations: [ManagePlanComponent],
    imports: [ManagePlanRouting, ComponentsModule],
    bootstrap: [ManagePlanComponent],
})
export class ManagePlanModule {}
