import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { AddEditComplaintTypeHtmlRenderer } from './add-edit-complaint-type.html.renderer';
import { CommonFunctions } from "@classes/common-functions";

@Component({
    selector: 'app-add-edit-complaint-type',
    templateUrl: './add-edit-complaint-type.component.html',
    styleUrls: ['./add-edit-complaint-type.component.css']
})
export class AddEditComplaintTypeComponent implements OnInit {
    @Input() user;
    @Input() editingCompalaintType;
    @Input() complaintTypeList;
    @Input() statusList;
    @Input() employeeList;
    @Input() typeName;
    @Input() defaultText;
    @Input() defaultStatus;
    @Input() defaultStatusId;
    @Input() editingComplaintTypeId;
    @Input() selectedEmployeeList;
    @Input() applicableEmployeeList;
    @Input() applicableStatusList;
    @Output() addStatusClick = new EventEmitter<any>();
    @Output() saveClicked = new EventEmitter<any>();
    @Output() cancelClicked = new EventEmitter<any>();


    addStatusName: string = "";
    addressToSearchString: string = "";
    searchedEmployeeList: any = [];

    htmlRenderer: AddEditComplaintTypeHtmlRenderer;

    constructor() { }

    ngOnInit() {
        this.htmlRenderer = new AddEditComplaintTypeHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);

        this.applicableStatusList.sort((a, b) => (a.id - b.id));
    }

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

    /* Add new status */
    triggerAddStatusClick() {
        let response = [];
        response.push(this.typeName.toString().trim());
        response.push(this.defaultText.toString().trim());
        response.push(this.defaultStatus);
        response.push(this.defaultStatusId);
        response.push(this.editingComplaintTypeId);
        response.push(this.addStatusName);

        this.addStatusClick.emit(response);
        this.addStatusName = "";
    }  // Ends: triggerAddStatusClick()

    /* Cancel Button Clicked */
    triggerCancelClicked() {
        this.cancelClicked.emit();
    }  // Ends: triggerCancelClicked()

    /* Save Complaint Type */
    triggerSaveClicked() {
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
            alert("Please select default status.");
            return;
        }

        let response = [];
        response.push(this.typeName.toString().trim());
        response.push(this.defaultText.toString().trim());
        response.push(this.defaultStatus);
        response.push(this.defaultStatusId);
        response.push(this.editingComplaintTypeId);

        this.saveClicked.emit(response);
    }  // Ends: triggerSaveClicked()
}
