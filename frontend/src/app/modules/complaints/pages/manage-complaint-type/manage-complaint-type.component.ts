import { Component, OnInit } from '@angular/core';

import { CommonFunctions } from "../../../../classes/common-functions";
import { DataStorage } from "@classes/data-storage";

import { AddStatusModalComponent } from '@modules/complaints/pages/manage-complaint-type/component/add-status-modal/add-status-modal.component';
import { ManageComplaintTypeServiceAdapter } from './manage-complaint-type.service.adapter';
import { ManageComplaintTypeHtmlRenderer } from './manage-complaint-type.html.renderer';

import { MatDialog } from '@angular/material';
import { DeleteTableModalComponent } from '@modules/complaints/component/delete-table-modal/delete-table-modal.component';


@Component({
    selector: 'app-manage-complaint-type',
    templateUrl: './manage-complaint-type.component.html',
    styleUrls: ['./manage-complaint-type.component.css']
})
export class ManageComplaintTypeComponent implements OnInit {
    user: any;
    isLoading: boolean;

    name: string;
    pageName: string = "showTables";

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

    serviceAdapter: ManageComplaintTypeServiceAdapter;
    htmlRenderer: ManageComplaintTypeHtmlRenderer;

    constructor(
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new ManageComplaintTypeServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlRenderer = new ManageComplaintTypeHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);
    }

    /* Unselect All Status */
    unselectAllStatus() {
        this.statusList.forEach((status) => {
            status.selected = false;
        });
    }  // Ends: unselectAllStatus()

    /* Initialize Complaint Type Details */
    initializeComplaintTypeDetails() {
        this.editingCompalaintType = false;
        this.typeName = "";
        this.defaultText = "";
        this.addressToSearchString = "";
        this.addStatusName = "";
        this.defaultStatus = "Not Selected";
        this.defaultStatusId = null;
        this.editingCompalaintTypeIndex = null;
        this.editingComplaintTypeId = null;
        this.applicableStatusList = [];
        this.applicableStatusTempList = [];
        this.selectedEmployeeList = [];
        this.searchedEmployeeList = [];
        this.applicableEmployeeList = [];
        this.unselectAllStatus();
    }  // Ends: initializeComplaintTypeDetails()

    /* Initialize Complaint Type List */
    initializecomplaintTypeList(complaintTypeList) {
        complaintTypeList.forEach((complaintType) => {
            complaintType["addressEmployeeList"] = [];
            complaintType["parentSchoolComplaintStatusDefault"] = this.getStatusFromId(complaintType["parentSchoolComplaintStatusDefault"]);
            this.complaintTypeList.push(complaintType);
        });

        for (let idx = 0; idx < this.complaintTypeList.length; idx++) {
            this.serviceAdapter.getEmployeeCompalintType(this.complaintTypeList[idx].id, idx);
        }
    }  // Ends: initializecomplaintTypeList()

    /* Initialize Status List */
    initializeStatusList(statusList) {
        this.statusList = [];

        statusList.forEach((status) => {
            status["selected"] = false;
            this.statusList.push(status);
        });
    }  // Ends: initializeStatusList()

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
    }  // Ends: initializeEmployeeList()

    /* Check Existence of Employee */
    checkEmployeeExist(employeeId) {
        for (let i = 0; i < this.selectedEmployeeList.length; i++) {
            if (this.selectedEmployeeList[i].id == employeeId) {
                return true;
            }
        }

        return false;
    }  // Ends: checkEmployeeExist()

    /* Initialize Employee Data */
    initializeEmployeeData(employee) {
        let check = this.checkEmployeeExist(employee.id);

        if (!check) {
            let employeeCopy = CommonFunctions.getInstance().deepCopy(employee);
            employeeCopy["selected"] = true;
            this.selectedEmployeeList.push(employeeCopy);
        }
    }  // Ends: initializeEmployeeData()

    /* Initialize Applicable Status List */
    initializeStatusComplaintType(statusComplaintTypeList) {
        this.applicableStatusList = [];
        statusComplaintTypeList.forEach((statusComplaintType) => {
            let status = this.getStatusFromId(statusComplaintType.parentSchoolComplaintStatus);
            status["selected"] = true;
            this.applicableStatusList.push(status);
        });
        this.applicableStatusTempList = CommonFunctions.getInstance().deepCopy(this.applicableStatusList);
    }  // Ends: initializeStatusComplaintType()

    /* Initialize Address-TO-Employee List */
    initializeEmployeeComplaintType(employeeComplaintTypeList, idx) {
        this.complaintTypeList[idx]["addressEmployeeList"] = [];
        employeeComplaintTypeList.forEach((employeeComplaintType) => {
            let employee = this.getEmployeeFromId(employeeComplaintType.parentEmployee);
            employee["selected"] = true;

            this.complaintTypeList[idx]["addressEmployeeList"].push(employee);
        });
    }  // Ends: initializeEmployeeComplaintType()

    /* Get Searched Employee List */
    searchEmployee() {
        this.searchedEmployeeList = [];
        if (!this.addressToSearchString) {
            return ;
        }

        this.employeeList.forEach((employee) => {
            if (employee.name.toLowerCase().indexOf(this.addressToSearchString.toLowerCase()) === 0) {
                this.searchedEmployeeList.push(employee);
            }
        });
    }  // Ends: searchEmployee()

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
                statusList: this.statusList,
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            if (data && data["statusName"]) {
                this.addStatusName = data["statusName"];
                this.addStatusClick();
            }
        });
    }  // Ends: openAddStatusDialog()

    /* Open Change Status Modal */
    openChangeStatusDialog(status, idx): void {
        const dialogRef = this.dialog.open(AddStatusModalComponent, {
            data: {
                operation: "Edit",
                statusName: status.name,
                statusList: this.statusList,
                statusId: status.id,
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            if (data && data["operation"]) {
                if (data["operation"] == "delete") {
                    this.deleteStatus(status, idx);
                }
            } else if (data && data["statusName"]) {
                let statusObject = {};
                statusObject["name"] = data["statusName"];
                statusObject["parentSchool"] = this.user.activeSchool.dbId;
                statusObject["id"] = status.id;
                this.serviceAdapter.updateStatus(statusObject);
                this.statusList[idx]["name"] = data["statusName"];
            }
        });
    }  // Ends: openChangeStatusDialog()

    /* Add New Status */
    addStatusClick() {
        this.serviceAdapter.addStatus();
    }  // Ends: addStatusClick()

    /* Get Status */
    getStatusFromId(id) {
        for (let i = 0; i < this.statusList.length; i++) {
            if (this.statusList[i].id == id) {
                return this.statusList[i];
            }
        }
    }  // Ends: getStatusFromId()

    /* Get Employee */
    getEmployeeFromId(id) {
        for (let i = 0; i < this.employeeList.length; i++) {
            if (this.employeeList[i].id == id) {
                return this.employeeList[i];
            }
        }
    }  // Ends: getEmployeeFromId()

    /* Get Applicable Status */
    getApplicableStatusId(id) {
        for (let i = 0; i < this.applicableStatusList.length; i++) {
            if (this.applicableStatusList[i].id == id) {
                return i;
            }
        }
        return -1;
    }  // Ends: getApplicableStatusId()

    /* Add Status to Applicable-Status-List */
    applicableStatusClicked(status) {
        let isSelected = !status.selected;
        if (isSelected) {
            let tempStatus = CommonFunctions.getInstance().deepCopy(status);
            this.applicableStatusList.push(tempStatus);
        } else {
            if (this.defaultStatus == status.name) {
                this.defaultStatus = "Not Selected";
            }

            let idx = this.getApplicableStatusId(status.id);
            if (idx != -1) {
                this.applicableStatusList.splice(idx, 1);
            }
        }
        this.applicableStatusList.sort((a, b) => (a.id - b.id));
    }  // Ends: applicableStatusClicked()

    /* Save Complaint Type */
    saveClicked() {

        /* Check Type Name */
        if (!this.typeName.toString().trim()) {
            alert("Please enter complaint type name.");
            return;
        }

        if (!this.htmlRenderer.checkTypeNameUniqueness()) {
            alert("Complaint type name must be unique.");
            return;
        }

        /* Check Assigned Employees */
        let employeeComplaintTypeCount = 0;
        this.selectedEmployeeList.forEach((employee) => {
            if (employee.selected) {
                employeeComplaintTypeCount++;
            }
        });
        if (!employeeComplaintTypeCount) {
            alert("Please assign employees.");
            return;
        }

        /* Check Applicable Statuses */
        if (!this.applicableStatusList.length) {
            alert("Please assign status.");
            return;
        }

        /* Check Default Status */
        if (this.defaultStatus == "Not Selected") {
            alert("Please enter default status.");
            return;
        }

        if (this.editingCompalaintType) {
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
    }  // Ends: saveClicked()

    /* Cancel Clicked */
    cancelClicked() {
        if (this.applicableEmployeeList.length) {
            this.complaintTypeList[this.editingCompalaintTypeIndex]["addressEmployeeList"] = this.applicableEmployeeList;
        }
        this.initializeComplaintTypeDetails();
        this.pageName = "showTables";
    }  // Ends: cancelClicked()

    /* Edit Complaint Type */
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
        this.serviceAdapter.getStatusCompalintType();
    }  // Ends: editComplaintType()

    /* Delete Complaint Type */
    deleteComplaintType(complaintType, idx) {
        const dialogRef = this.dialog.open(DeleteTableModalComponent, {
            data: {
                formatName: complaintType.name,
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            if (data && data["operation"] && data["operation"] == "Delete") {
                this.serviceAdapter.deleteCompalintType(complaintType, idx);
            }
        });
    }  // Ends: deleteComplaintType()

    /* Delete Status */
    deleteStatus(status, idx) {
        const dialogRef = this.dialog.open(DeleteTableModalComponent, {
            data: {
                formatName: status.name,
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            if (data && data["operation"] && data["operation"] == "Delete") {
                this.serviceAdapter.deleteStatus(status, idx);
            }
        });
    }  // Ends: deleteStatus()
}
