import { Component, OnInit, Inject } from '@angular/core';
import { DataStorage } from "@classes/data-storage";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AssignEmployeeModalServiceAdapter } from './assign-employee-modal.service.adapter';
import { CommonFunctions } from "@classes/common-functions";


@Component({
    selector: 'app-assign-employee-modal',
    templateUrl: './assign-employee-modal.component.html',
    styleUrls: ['./assign-employee-modal.component.css']
})
export class AssignEmployeeModalComponent implements OnInit {
    user: any;

    addressToSearchString: string = ""; /* Employee Search String */

    openedComplaint: any = {};

    employeeList: any = [];
    searchedEmployeeList: any = [];
    selectedEmployeeList: any = [];
    tempSelectedEmployeeList: any = [];
    newlyAssignedEmployeeList: any = [];
    removeEmployeeList: any = [];

    selectedEmployee: any;
    tempEmployeeList: any;

    serviceAdapter: AssignEmployeeModalServiceAdapter;


    constructor(
        public dialogRef: MatDialogRef<AssignEmployeeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {

        /* Starts: Initialize data */
        this.employeeList = data.employeeList;
        this.openedComplaint = data.openedComplaint;
        this.selectedEmployeeList = data.employeeComplaintList;
        this.tempSelectedEmployeeList = CommonFunctions.getInstance().deepCopy(data.employeeComplaintList);
        /* Ends: Initialize data */
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new AssignEmployeeModalServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
    }

    /* Renotify an employee */
    renotifyClicked(employee) {
        this.serviceAdapter.sendNotification(employee);
    }  // Ends: renotifyClicked()

    /* Save Modal */
    saveClicked() {
        let data = {};
        if (this.newlyAssignedEmployeeList.length > 0) {
            data["newlyAssignedEmployeeList"] = this.newlyAssignedEmployeeList;
        }

        if (this.removeEmployeeList.length > 0) {
            data["removeEmployeeList"] = this.removeEmployeeList;
        }

        this.dialogRef.close(data);
    }  // Ends: saveClicked()

    /* Close Modal */
    closeClicked() {
        let data = {};
        data["employeeComplaintList"] = this.tempSelectedEmployeeList;
        this.dialogRef.close(data);
    }  // Ends: closeClicked()

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

        /* Check an employee is already assigned or not */
        for (let i = 0; i < this.selectedEmployeeList.length; i++) {
            if (this.selectedEmployeeList[i].id == employeeId) {
                return true;
            }
        }

        /* Check an employee is already added to a list of newly-assigned-employees or not */
        for (let i = 0; i < this.newlyAssignedEmployeeList.length; i++) {
            if (this.newlyAssignedEmployeeList[i].id == employeeId) {
                return true;
            }
        }

        return false;
    }  // Ends: checkEmployeeExist()

    removeEmployeeFromRemoveEmployeeList(employeeId) {
        let idx = -1;
        for (let i = 0; i < this.removeEmployeeList.length; i++) {
            if (this.removeEmployeeList[i].parentEmployee == employeeId) {
                idx = i;
                break;
            }
        }

        if (idx != -1) {
            this.removeEmployeeList.splice(idx, 1);
        }
    }

    /* Initialize Employee Data */
    initializeEmployeeData(employee) {
        let check = this.checkEmployeeExist(employee.id);

        if (!check) {
            let employeeCopy = CommonFunctions.getInstance().deepCopy(employee);
            employeeCopy["selected"] = true;
            this.newlyAssignedEmployeeList.push(employeeCopy);

            this.removeEmployeeFromRemoveEmployeeList(employee.id);
        }
    }  // Ends: initializeEmployeeData()

    removeEmployee(employee, idx) {
        let deleteData = {
            parentEmployee: employee.id,
            parentComplaint: this.openedComplaint.id,
        };

        this.selectedEmployeeList.splice(idx, 1);
        this.removeEmployeeList.push(deleteData);
    }
}
