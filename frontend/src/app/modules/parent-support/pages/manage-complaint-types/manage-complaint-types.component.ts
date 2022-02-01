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
    defaultStatus: string = "Not Selected";
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
        this.defaultStatus = "Not Selected";
        this.applicableStatusList = [];
        this.applicableStatusTempList = [];
        this.selectedEmployeeList = [];
        this.searchedEmployeeList = [];
        this.applicableEmployeeList = [];
        this.unselectAllStatus();
    }

    isMobile() {
        if(window.innerWidth > 991) {
            return false;
        }
        return true;
    }

    setCancelBtnStyle() {
        let color = "white";
        if(this.user.activeSchool.secondaryThemeColor == "primary") {
            color = "#1976D2";
        } else if(this.user.activeSchool.secondaryThemeColor == "warning") {
            color = "#FFC107";
        } else if(this.user.activeSchool.secondaryThemeColor == "secondary") {
            color = "#424242";
        } else if(this.user.activeSchool.secondaryThemeColor == "accent") {
            color = "#82B1FF";
        } else if(this.user.activeSchool.secondaryThemeColor == "error") {
            color = "#FF5252";
        } else if(this.user.activeSchool.secondaryThemeColor == "info") {
            color = "#2196F3";
        } else if(this.user.activeSchool.secondaryThemeColor == "success") {
            color = "#4CAF50";
        }

        let style = {
            'border': '1.5px solid ' + color,
        };

        return style;
    }

    initializecomplaintTypeList(complaintTypeList) {
        complaintTypeList.forEach((complaintType) => {
            complaintType["addressEmployeeList"] = [];

            let id = complaintType["parentSchoolComplaintStatusDefault"];
            complaintType["parentSchoolComplaintStatusDefault"] = this.getStatusFromId(id);
            this.complaintTypeList.push(complaintType);
        });

        for(let i = 0; i < this.complaintTypeList.length; i++) {
            this.serviceAdapter.getEmployeeCompalintType(this.complaintTypeList[i].id, i);
        }
        console.log("Complaint Type List: ", this.complaintTypeList);
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
            let status = this.getStatusFromId(statusComplaintType.parentSchoolComplaintStatus);
            status["selected"] = true;
            this.applicableStatusList.push(status);
        });
        this.applicableStatusTempList = CommonFunctions.getInstance().deepCopy(this.applicableStatusList);
    }

    initializeEmployeeComplaintType(employeeComplaintTypeList, idx) {
        this.complaintTypeList[idx]["addressEmployeeList"] = [];
        employeeComplaintTypeList.forEach((employeeComplaintType) => {
            let employee = this.getEmployeeFromId(employeeComplaintType.parentEmployee);
            employee["selected"] = true;
            this.complaintTypeList[idx]["addressEmployeeList"].push(employee);
        });
        console.log("complaintType Employee: ", this.complaintTypeList[idx]["addressEmployeeList"]);
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

    /* Debouncing */
    debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
        clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
         };
    }  // Ends: debounce()

    seachChanged = this.debounce(() => this.searchEmployee());

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
        this.addStatusName = "";
        // this.initializeComplaintTypeDetails();
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
            let tempStatus = CommonFunctions.getInstance().deepCopy(status);
            this.applicableStatusList.push(tempStatus);
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
            complaintTypeObject["parentSchoolComplaintStatusDefault"] = this.defaultStatusId;
            complaintTypeObject["parentSchool"] = this.user.activeSchool.dbId;
            complaintTypeObject["id"] = this.editingComplaintTypeId;
            this.serviceAdapter.updateCompalintType(complaintTypeObject);

            this.complaintTypeList[this.editingCompalaintTypeIndex]["name"] = complaintTypeObject["name"];
            this.complaintTypeList[this.editingCompalaintTypeIndex]["defaultText"] = complaintTypeObject["defaultText"];
            this.complaintTypeList[this.editingCompalaintTypeIndex]["parentSchoolComplaintStatusDefault"] = this.getStatusFromId(this.defaultStatusId);
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
        this.defaultStatus = complaintType.parentSchoolComplaintStatusDefault.name;
        this.defaultStatusId = complaintType.parentSchoolComplaintStatusDefault.id;
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
        this.serviceAdapter.deleteStatus(status);
        this.statusList.splice(idx, 1);
    }
}
