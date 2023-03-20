import { Component, OnInit } from "@angular/core";
import { User } from "@classes/user";
import { GenericService } from "@services/generic/generic-service";
import ManagePlanServiceAdapter from "./manage_plan.service.adapter";

@Component({
    selector: "manage-plan",
    templateUrl: "./manage_plan.component.html",
    styleUrls: ["./manage_plan.component.css"],
    providers: [GenericService],
})
export class ManagePlanComponent implements OnInit {
    user: User;
    serviceAdapter: ManagePlanServiceAdapter = new ManagePlanServiceAdapter();
    constructor(public genericService: GenericService) {}
    ngOnInit(): void {
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }
    // page manage variables
    isLoading: boolean = false;
    isLeavePlanOpen: boolean = false;
    leavePlanName: string = "";
    isAddNewOpen: boolean = false;
    currentLeavePlan: any = {};
    // data variables
    leavePlanList: Array<{ [id: string]: string }> = [];

    savePlan(): void {
        this.serviceAdapter.handleDataChange({ leavePlanName: this.leavePlanName }, "insert");
        this.isAddNewOpen = false;
    }
}
