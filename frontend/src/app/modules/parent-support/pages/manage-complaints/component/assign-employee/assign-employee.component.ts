import { Component, OnInit, Inject } from '@angular/core';
import { DataStorage } from "@classes/data-storage";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AssignEmployeeServiceAdapter } from './assign-employee.service.adapter';
import { CommonFunctions } from "@classes/common-functions";


@Component({
    selector: 'app-assign-employee',
    templateUrl: './assign-employee.component.html',
    styleUrls: ['./assign-employee.component.css']
})
export class AssignEmployeeComponent implements OnInit {
    user: any;

    addressToSearchString: string = ""; /* Employee Search String */

    openedComplaint: any = {};

    employeeList: any = [];
    searchedEmployeeList: any = [];
    selectedEmployeeList: any = [];
    employeeComplaintList: any = [];
    newlyAssignedEmployeeList: any = [];

    serviceAdapter: AssignEmployeeServiceAdapter;


    constructor(
        public dialogRef: MatDialogRef<AssignEmployeeComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {

        /* Starts: Initialize data */
        this.employeeList = data.employeeList;
        this.openedComplaint = data.openedComplaint;
        this.selectedEmployeeList = data.employeeComplaintList;
        this.employeeComplaintList = data.employeeComplaintList;
        /* Ends: Initialize data */
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new AssignEmployeeServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
    }

    /* Renotify an employee */
    renotifyClicked(employee) {
        this.serviceAdapter.sendNotification(employee);
    }  // Ends: renotifyClicked()

    /* Save Modal */
    saveClicked() {
        let data = {};
        data["newlyAssignedEmployeeList"] = this.newlyAssignedEmployeeList;

        this.dialogRef.close(data);
    }  // Ends: saveClicked()

    /* Close Modal */
    closeClicked() {
        this.dialogRef.close();
    }  // Ends: closeClicked()

    /* Map Bootstarp Color Name to Hex-Color Code */
    setCancelBtnStyle() {
        let color = "white";
        if (this.user.activeSchool.secondaryThemeColor == "primary") {
            color = "#1976D2";
        } else if (this.user.activeSchool.secondaryThemeColor == "warning") {
            color = "#FFC107";
        } else if (this.user.activeSchool.secondaryThemeColor == "secondary") {
            color = "#424242";
        } else if (this.user.activeSchool.secondaryThemeColor == "accent") {
            color = "#82B1FF";
        } else if (this.user.activeSchool.secondaryThemeColor == "error") {
            color = "#FF5252";
        } else if (this.user.activeSchool.secondaryThemeColor == "info") {
            color = "#2196F3";
        } else if (this.user.activeSchool.secondaryThemeColor == "success") {
            color = "#4CAF50";
        }

        let style = {
            'border': '1.5px solid ' + color,
        };

        return style;
    }  // Ends: setCancelBtnStyle()

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

    searchChanged = this.debounce(() => this.searchEmployee());

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

    /* Initialize Employee Data */
    initializeEmployeeData(employee) {
        let check = this.checkEmployeeExist(employee.id);

        if (!check) {
            let employeeCopy = CommonFunctions.getInstance().deepCopy(employee);
            employeeCopy["selected"] = true;
            this.newlyAssignedEmployeeList.push(employeeCopy);
        }
    }  // Ends: initializeEmployeeData()

}
