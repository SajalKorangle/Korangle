import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { ManageTypeComponent } from "./manage_type.component";

const routes: Routes = [
    {
        path: "",
        component: ManageTypeComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ManageTypeRouting {}
