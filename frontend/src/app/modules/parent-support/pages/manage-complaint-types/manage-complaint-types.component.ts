import { Component, OnInit } from '@angular/core';

import { CommonFunctions } from "../../../../classes/common-functions";
import { DataStorage } from "@classes/data-storage";

import { AddStatusModalComponent } from '@modules/parent-support/component/add-status-modal/add-status-modal.component';
import { ManageComplaintTypesServiceAdapter } from './manage-complaint-types.service.adapter';

import { MatDialog } from '@angular/material';


@Component({
    selector: 'app-manage-complaint-types',
    templateUrl: './manage-complaint-types.component.html',
    styleUrls: ['./manage-complaint-types.component.css']
})
export class ManageComplaintTypesComponent implements OnInit {
    user: any;
    isLoading: boolean;

    name: string;
    pageName: string = "showTables";

    helloCheckBox: boolean;

    maxAge: number;

    addStatusName: string = "";
    statusList: any = [];
    applicableStatusList: any = [];
    applicableStatusTempList: any = [];

    selectedEmployeeList: any = [];
    employeeList: any = [];
    searchedEmployeeList: any = [];
    applicableEmployeeList: any = [];

    editingCompalaintType: boolean = false;
    editingCompalaintTypeIndex: number;
    editingComplaintTypeId: number;
    typeName: string = "";
    defaultText: string = "";
    addressToSearchString: string = "";
    defaultStatus: string = "Select Default Status";
    defaultStatusId: number = 0;
    complaintTypeList: any = [];

    serviceAdapter: ManageComplaintTypesServiceAdapter;

    constructor(
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);

        this.serviceAdapter = new ManageComplaintTypesServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    unselectAllStatus() {
        this.statusList.forEach((status) => {
            status.selected = false;
        });
    }

    initializeComplaintTypeDetails() {
        this.editingCompalaintType = false;
        this.typeName = "";
        this.defaultText = "";
        this.addressToSearchString = "";
        this.addStatusName = "";
        this.defaultStatus = "Select Default Status";
        this.applicableStatusList = [];
        this.applicableStatusTempList = [];
        this.selectedEmployeeList = [];
        this.searchedEmployeeList = [];
        this.applicableEmployeeList = [];
        this.unselectAllStatus();
    }

    initializecomplaintTypeList(complaintTypeList) {
        complaintTypeList.forEach((element) => {
            let complaintType = {};
            complaintType["defaultText"] = element["defaultText"];
            complaintType["id"] = element["id"];
            complaintType["name"] = element["name"];
            complaintType["parentSchool"] = element["parentSchool"];
            complaintType["parentStatusDefault"] = element["parentStatusDefault"];
            complaintType["addressEmployeeList"] = [];
            this.complaintTypeList.push(complaintType);
        });

        for(let i = 0; i < this.complaintTypeList.length; i++) {
            this.serviceAdapter.getEmployeeCompalintType(this.complaintTypeList[i].id, i);
        }
    }

    initializeStatusList(statusList) {
        statusList.forEach((status) => {
            status["selected"] = false;
            this.statusList.push(status);
        });
        console.log("Status List: ", this.statusList);
    }

    /* Initialize Employee List */
    initializeEmployeeList(employeeList: any): void {
        this.employeeList = [];

        employeeList.forEach((employee) => {
            let tempEmployee = {};
            tempEmployee["name"] = employee["name"];
            tempEmployee["id"] = employee["id"];
            tempEmployee["selected"] = false;
            this.employeeList.push(tempEmployee);
        });
    }

    checkEmployeeExist(employeeId) {
        for(let i = 0; i < this.selectedEmployeeList.length; i++) {
            if(this.selectedEmployeeList[i].id == employeeId) {
                return true;
            }
        }

        return false;
    }

    initializeEmployeeData(employee) {
        let check = this.checkEmployeeExist(employee.id);

        if(!check) {
            let employeeCopy = CommonFunctions.getInstance().deepCopy(employee);
            employeeCopy["selected"] = true;
            this.selectedEmployeeList.push(employeeCopy);
        }
    }

    initializeStatusComplaintType(statusComplaintTypeList) {
        this.applicableStatusList = [];
        statusComplaintTypeList.forEach((statusComplaintType) => {
            let status = this.getStatusFromId(statusComplaintType.parentStatus);
            status["selected"] = true;
            this.applicableStatusList.push(status);
        });
        this.applicableStatusTempList = CommonFunctions.getInstance().deepCopy(this.applicableStatusList);
    }

    initializeEmployeeComplaintType(employeeComplaintTypeList, idx) {
        // this.selectedEmployeeList = [];
        // employeeComplaintTypeList.forEach((employeeComplaintType) => {
        //     let employee = this.getEmployeeFromId(employeeComplaintType.parentEmployee);
        //     employee["selected"] = true;
        //     this.selectedEmployeeList.push(employee);
        // });
        // this.applicableEmployeeList = CommonFunctions.getInstance().deepCopy(this.selectedEmployeeList);

        this.complaintTypeList[idx]["addressEmployeeList"] = [];
        employeeComplaintTypeList.forEach((employeeComplaintType) => {
            let employee = this.getEmployeeFromId(employeeComplaintType.parentEmployee);
            employee["selected"] = true;
            this.complaintTypeList[idx]["addressEmployeeList"].push(employee);
        });
    }

    searchEmployee() {
        this.searchedEmployeeList = [];
        if(!this.addressToSearchString) {
            return ;
        }

        this.employeeList.forEach((employee) => {
            if (employee.name.toLowerCase().indexOf(this.addressToSearchString.toLowerCase()) === 0) {
                this.searchedEmployeeList.push(employee);
            }
        });
        console.log("Searched Employee List: ", this.searchedEmployeeList);
    }

    /* Open Add Status Modal */
    openAddStatusDialog(): void {
        const dialogRef = this.dialog.open(AddStatusModalComponent, {
            data: {
                operation: "Add",
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            console.log("Data: ", data);
            if(data && data["statusName"]) {
                this.addStatusName = data["statusName"];
                this.addStatusClick();
            }
        });
    }

    /* Open Edit Filter Modal */
    openChangeStatusDialog(status, idx): void {
        const dialogRef = this.dialog.open(AddStatusModalComponent, {
            data: {
                operation: "Edit",
                statusName: status.name,
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            console.log("Data: ", data);
            if(data && data["operation"]) {
                if(data["operation"] == "delete") {
                    this.deleteStatus(status, idx);
                }
            } else if(data && data["statusName"]) {
                let statusObject = {};
                statusObject["name"] = data["statusName"];
                statusObject["parentSchool"] = this.user.activeSchool.dbId;
                statusObject["id"] = status.id;
                this.serviceAdapter.updateStatus(statusObject);
                this.statusList[idx]["name"] = data["statusName"];
            }
        });
    }

    addStatusClick() {
        if(this.addStatusName) {
            this.serviceAdapter.addStatus();
        }
        this.initializeComplaintTypeDetails();
    }

    getStatusFromId(id) {
        for(let i = 0; i < this.statusList.length; i++) {
            if(this.statusList[i].id == id) {
                return this.statusList[i];
            }
        }
    }

    getEmployeeFromId(id) {
        for(let i = 0; i < this.employeeList.length; i++) {
            if(this.employeeList[i].id == id) {
                return this.employeeList[i];
            }
        }
    }

    getApplicableStatusId(id) {
        for(let i = 0; i < this.applicableStatusList.length; i++) {
            if(this.applicableStatusList[i].id == id) {
                return i;
            }
        }
        return -1;
    }

    applicableStatusClicked(status) {
        let isSelected = !status.selected;
        if(isSelected) {
            this.applicableStatusList.push(status);
        } else {
            if(this.defaultStatus == status.name) {
                this.defaultStatus = "Select Default Status";
            }
            let idx = this.getApplicableStatusId(status.id);
            if(idx != -1) {
                this.applicableStatusList.splice(idx, 1);
            }
        }
    }

    saveClicked() {
        let complaintType = {};

        if(!this.typeName) {
            alert("Please enter complaint type name.");
            return;
        }

        if(!this.defaultText) {
            alert("Please enter default text.");
            return;
        }

        if(!this.defaultStatus) {
            alert("Please enter default status.");
            return;
        }

        if(this.editingCompalaintType) {
            let complaintTypeObject = {};
            complaintTypeObject["name"] = this.typeName;
            complaintTypeObject["defaultText"] = this.defaultText;
            complaintTypeObject["parentStatusDefault"] = this.defaultStatusId;
            complaintTypeObject["parentSchool"] = this.user.activeSchool.dbId;
            complaintTypeObject["id"] = this.editingComplaintTypeId;
            this.serviceAdapter.updateCompalintType(complaintTypeObject);
            this.complaintTypeList[this.editingCompalaintTypeIndex] = complaintTypeObject;
            this.editingCompalaintType = false;
        } else {
            this.serviceAdapter.addCompalintType();
        }
    }

    cancelClicked() {
        this.initializeComplaintTypeDetails();
        this.pageName = "showTables";
    }

    editComplaintType(complaintType, idx) {
        this.typeName = complaintType.name;
        this.defaultText = complaintType.defaultText;
        this.defaultStatus = this.getStatusFromId(complaintType.parentStatusDefault)["name"];
        this.defaultStatusId = complaintType.parentStatusDefault;
        this.editingCompalaintType = true;
        this.editingCompalaintTypeIndex = idx;
        this.editingComplaintTypeId = complaintType.id;
        this.selectedEmployeeList = complaintType.addressEmployeeList;
        this.applicableEmployeeList = CommonFunctions.getInstance().deepCopy(this.selectedEmployeeList);
        // this.serviceAdapter.getEmployeeCompalintType();
        this.serviceAdapter.getStatusCompalintType();
    }

    deleteComplaintType(complaintType, idx) {
        this.serviceAdapter.deleteCompalintType(complaintType);
        this.complaintTypeList.splice(idx, 1);
    }

    deleteStatus(status, idx) {
        console.log("Delete Status Called.");
        this.serviceAdapter.deleteStatus(idx);
        this.statusList.splice(idx, 1);
    }
}
