import { Component, OnInit } from "@angular/core";
import { User } from "@classes/user";
import { GenericService } from "@services/generic/generic-service";
import GenericServiceAdapter from "../../leaves.service.adapter";

@Component({
    selector: "manage-leave-plan",
    templateUrl: "./manage_leave_plan.component.html",
    styleUrls: ["./manage_leave_plan.component.css"],
    providers: [GenericService],
})
export class ManageLeavePlanComponent implements OnInit {
    user: User;
    serviceAdapterGeneric: GenericServiceAdapter = new GenericServiceAdapter();
    constructor(public genericService: GenericService) {}
    ngOnInit(): void {
        this.serviceAdapterGeneric.initializeAdapter(this);
    }
    // employee Choice List
    employeeChoiceList: Array<any> = [];
}
