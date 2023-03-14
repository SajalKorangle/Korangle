import { Component, Input, OnInit } from "@angular/core";
import { User } from "@classes/user";
import { GenericService } from "@services/generic/generic-service";
import ManageTypeServiceAdapter from "./manage_type.service.adapter";
@Component({
    selector: "manage-type",
    templateUrl: "./manage_type.component.html",
    styleUrls: ["./manage_type.component.css"],
    providers: [GenericService],
})
export class ManageTypeComponent implements OnInit {
    user: User;
    // service Adapter
    serviceAdapter: ManageTypeServiceAdapter = new ManageTypeServiceAdapter();
    // page variables
    leaveTypeList: any = [];
    isFormVisible: boolean = false;
    isLoading: boolean = true;
    formData: any = {};
    ngOnInit() {
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }
    constructor(public genericService: GenericService) {}
    // handle Modal
    addNewType(event, data): void {
        this.formData = data;
        this.isFormVisible = true;
    }
    closeAddNewType(event): void {
        this.isFormVisible = false;
    }
    async saveLeaveType(data): Promise<any> {
        const isNew: boolean = data.isNew;
        delete data.isNew;
        let response = isNew ? (await this.serviceAdapter.handleDataChange(data, 'insert')) : (await this.serviceAdapter.handleDataChange(data, 'update'));
        if (response !== null && response !== undefined && JSON.stringify(response) !== "{}") {
            this.closeAddNewType(null);
        }
    }
    async deleteType(event, data): Promise<any> {
        await this.serviceAdapter.handleDataChange(data, 'delete');
    }
}
