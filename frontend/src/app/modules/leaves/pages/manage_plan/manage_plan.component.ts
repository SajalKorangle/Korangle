import { Component, Input, OnInit } from "@angular/core";
import { GenericService } from "@services/generic/generic-service";

@Component({
    selector: "manage-plan",
    templateUrl: "./manage_plan.component.html",
    styleUrls: ["./manage_plan.component.css"],
    providers: [GenericService],
})
export class ManagePlanComponent {
    constructor() {}
}
