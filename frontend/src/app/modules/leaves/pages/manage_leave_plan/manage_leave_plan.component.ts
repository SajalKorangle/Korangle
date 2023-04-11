import { Component, OnInit } from "@angular/core";
import { User } from "@classes/user";
import { GenericService } from "@services/generic/generic-service";
import { LeavePlan, LeavePlanToEmployee, LeavePlanToLeaveType, LeaveType } from "@modules/leaves/classes/leaves";
import ManageTypeServiceAdapter from "../manage_type/manage_type.service.adapter";

@Component({
    selector: "manage-leave-plan",
    templateUrl: "./manage_leave_plan.component.html",
    styleUrls: ["./manage_leave_plan.component.css"],
    providers: [GenericService],
})
export class ManageLeavePlanComponent implements OnInit {
    user: User;
    serviceAdapterGeneric: ManageTypeServiceAdapter = new ManageTypeServiceAdapter();
    constructor(public genericService: GenericService) {}
    ngOnInit(): void {
        // ignore
    }
}
