import { ManageComplaintTypesComponent } from './manage-complaint-types.component';
import { Query } from '@services/generic/query';

export class ManageComplaintTypesServiceAdapter {
    vm: ManageComplaintTypesComponent;

    constructor() { }

    initializeAdapter(vm: ManageComplaintTypesComponent): void {
        this.vm = vm;
    }

    /* Initialize Data */
    async initializeData() {

        this.vm.isLoading = true;

        // Employee Query: Employee List  &&  Total Available Records.
        const complaintTypeQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ parent_support_app: 'ComplaintType' });

        const statusQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ parent_support_app: 'Status' });

        // Employee Query: Employee List
        const employeeQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ employee_app: 'Employee' });


        let complaintTypeList = [];
        let statusList = [];
        let employeeList = [];
        [
            complaintTypeList,   // 0
            statusList,   // 1
            employeeList,   // 2
        ] = await Promise.all([
            complaintTypeQuery,   // 0
            statusQuery,   // 1
            employeeQuery,   // 2
        ]);

        console.log("Complaint Type List: ", this.vm.complaintTypeList);
        this.vm.initializecomplaintTypeList(complaintTypeList);
        this.vm.initializeStatusList(statusList);
        this.vm.initializeEmployeeList(employeeList);
        this.vm.isLoading = false;
    }  // Ends: initializeData()

    async addStatus() {
        let statusObject = {};
        statusObject["name"] = this.vm.addStatusName;
        statusObject["parentSchool"] = this.vm.user.activeSchool.dbId;
        const response = await new Query().createObject({parent_support_app: 'Status'}, statusObject);
        response["selected"] = false;
        this.vm.statusList.push(response);
        console.log("Status Added: ", response);
    }

    async updateStatus(statusObject) {
        await new Query().updateObject({parent_support_app: 'Status'}, statusObject);
    }

    async deleteStatus(statusIndex) {
        let deleteStatusFilter = {};
        deleteStatusFilter["id"] = statusIndex;
        // await new Query().deleteObjectList({parent_support_app: 'Status'}, deleteStatusFilter);
    }

    async addStatusComplaintType(statusComplaintTypeList) {
        const response = await new Query().createObjectList({parent_support_app: 'StatusComplaintType'}, statusComplaintTypeList);
        console.log("Status-Complaint Type: ", response);
    }

    async addEmployeeComplaintType(employeeComplaintTypeList) {
        const response = await new Query().createObjectList({parent_support_app: 'EmployeeComplaintType'}, employeeComplaintTypeList);
        console.log("Employee-Complaint Type: ", response);
    }

    async addCompalintType() {
        let complaintTypeObject = {};
        complaintTypeObject["name"] = this.vm.typeName;
        complaintTypeObject["defaultText"] = this.vm.defaultText;
        complaintTypeObject["parentStatusDefault"] = this.vm.defaultStatusId;
        complaintTypeObject["parentSchool"] = this.vm.user.activeSchool.dbId;
        const response = await new Query().createObject({parent_support_app: 'ComplaintType'}, complaintTypeObject);
        this.vm.complaintTypeList.push(response);

        let statusComplaintTypeList = [];
        this.vm.applicableStatusList.forEach((status) => {
            let statusComplaintTypeObject = {};
            statusComplaintTypeObject["parentStatus"] = status.id;
            statusComplaintTypeObject["parentComplaintType"] = response.id;
            statusComplaintTypeList.push(statusComplaintTypeObject);
        });
        if(statusComplaintTypeList.length) {
            this.addStatusComplaintType(statusComplaintTypeList);
        }

        let employeeComplaintTypeList = [];
        this.vm.selectedEmployeeList.forEach((employee) => {
            if(employee.selected) {
                let employeeComplaintType = {};
                employeeComplaintType["parentEmployee"] = employee.id;
                employeeComplaintType["parentComplaintType"] = response.id;
                employeeComplaintTypeList.push(employeeComplaintType);
            }
        });
        if(employeeComplaintTypeList.length) {
            this.addEmployeeComplaintType(employeeComplaintTypeList);
        }

        this.vm.initializeComplaintTypeDetails();
        this.vm.pageName = "showTables";
    }

    async updateCompalintType(complaintTypeObject) {
        await new Query().updateObject({parent_support_app: 'ComplaintType'}, complaintTypeObject);

        console.log("List: ", this.vm.applicableStatusList);
        console.log("Temp List: ", this.vm.applicableStatusTempList);

        this.vm.applicableStatusList.sort((a,b) => a.id - b.id);
        this.vm.applicableStatusTempList.sort((a,b) => a.id - b.id);

        console.log("List: ", this.vm.applicableStatusList);
        console.log("Temp List: ", this.vm.applicableStatusTempList);
        let deleteStatusComplaintList = [];
        let createStatusComplaintList = [];

        let n = this.vm.applicableStatusList.length, i = 0;
        let m = this.vm.applicableStatusTempList.length, j = 0;
        while(i < n && j < m) {
            if(this.vm.applicableStatusList[i].id != this.vm.applicableStatusTempList[j].id) {
                if(this.vm.applicableStatusList[i].id > this.vm.applicableStatusTempList[j].id) {
                    let statusComplaintTypeObject = {};
                    statusComplaintTypeObject["parentStatus"] = this.vm.applicableStatusTempList[j].id;
                    statusComplaintTypeObject["parentComplaintType"] = complaintTypeObject.id;
                    deleteStatusComplaintList.push(statusComplaintTypeObject);
                    j++;
                } else {
                    let statusComplaintTypeObject = {};
                    statusComplaintTypeObject["parentStatus"] = this.vm.applicableStatusList[i].id;
                    statusComplaintTypeObject["parentComplaintType"] = complaintTypeObject.id;
                    createStatusComplaintList.push(statusComplaintTypeObject);
                    i++;
                }
            } else {
                i++;
                j++;
            }
        }

        while(i < n) {
            let statusComplaintTypeObject = {};
            statusComplaintTypeObject["parentStatus"] = this.vm.applicableStatusList[i].id;
            statusComplaintTypeObject["parentComplaintType"] = complaintTypeObject.id;
            createStatusComplaintList.push(statusComplaintTypeObject);
            i++;
        }

        while(j < m) {
            let statusComplaintTypeObject = {};
            statusComplaintTypeObject["parentStatus"] = this.vm.applicableStatusTempList[j].id;
            statusComplaintTypeObject["parentComplaintType"] = complaintTypeObject.id;
            deleteStatusComplaintList.push(statusComplaintTypeObject);
            j++;
        }

        console.log("Create List: ", createStatusComplaintList);
        console.log("Delete List: ", deleteStatusComplaintList);

        if(createStatusComplaintList.length) {
            this.addStatusComplaintType(createStatusComplaintList);
        }

        // if(deleteStatusComplaintList.length) {
        //     this.deleteStatusComplaintType(deleteStatusComplaintList);
        // }


        let selectedEmployeeList = [];
        this.vm.selectedEmployeeList.forEach((employee) => {
            if(employee.selected) {
                selectedEmployeeList.push(employee);
            }
        });

        console.log("List: ", selectedEmployeeList);
        console.log("Temp List: ", this.vm.applicableEmployeeList);

        selectedEmployeeList.sort((a,b) => a.id - b.id);
        this.vm.applicableEmployeeList.sort((a,b) => a.id - b.id);

        console.log("List: ", selectedEmployeeList);
        console.log("Temp List: ", this.vm.applicableEmployeeList);
        let deleteEmployeeComplaintList = [];
        let createEmployeeComplaintList = [];

        n = selectedEmployeeList.length, i = 0;
        m = this.vm.applicableEmployeeList.length, j = 0;
        while(i < n && j < m) {
            if(selectedEmployeeList[i].id != this.vm.applicableEmployeeList[j].id) {
                if(selectedEmployeeList[i].id > this.vm.applicableEmployeeList[j].id) {
                    let employeeComplaintTypeObject = {};
                    employeeComplaintTypeObject["parentEmployee"] = this.vm.applicableEmployeeList[j].id;
                    employeeComplaintTypeObject["parentComplaintType"] = complaintTypeObject.id;
                    deleteEmployeeComplaintList.push(employeeComplaintTypeObject);
                    j++;
                } else {
                    let employeeComplaintTypeObject = {};
                    employeeComplaintTypeObject["parentEmployee"] = selectedEmployeeList[i].id;
                    employeeComplaintTypeObject["parentComplaintType"] = complaintTypeObject.id;
                    createEmployeeComplaintList.push(employeeComplaintTypeObject);
                    i++;
                }
            } else {
                i++;
                j++;
            }
        }

        while(i < n) {
            let employeeComplaintTypeObject = {};
            employeeComplaintTypeObject["parentEmployee"] = selectedEmployeeList[i].id;
            employeeComplaintTypeObject["parentComplaintType"] = complaintTypeObject.id;
            createEmployeeComplaintList.push(employeeComplaintTypeObject);
            i++;
        }

        while(j < m) {
            let employeeComplaintTypeObject = {};
            employeeComplaintTypeObject["parentEmployee"] = this.vm.applicableEmployeeList[j].id;
            employeeComplaintTypeObject["parentComplaintType"] = complaintTypeObject.id;
            deleteEmployeeComplaintList.push(employeeComplaintTypeObject);
            j++;
        }

        console.log("Create List: ", createEmployeeComplaintList);
        console.log("Delete List: ", deleteEmployeeComplaintList);

        if(createEmployeeComplaintList.length) {
            this.addEmployeeComplaintType(createEmployeeComplaintList);
        }

        // if(deleteEmployeeComplaintList.length) {
        //     this.deleteStatusComplaintType(deleteEmployeeComplaintList);
        // }

        this.vm.initializeComplaintTypeDetails();
        this.vm.pageName = "showTables";
    }

    async deleteCompalintType(complaintTypeObject) {
        let deleteComplaintTypeList = [complaintTypeObject];
        // await new Query().deleteObjectList({parent_support_app: 'ComplaintType'}, deleteComplaintTypeList);
    }

    async getStatusCompalintType() {

        this.vm.isLoading = true;
        this.vm.pageName = "";

        const statusComplaintTypeQuery = new Query()
            .filter({ parentComplaintType: this.vm.editingComplaintTypeId })
            .getObjectList({ parent_support_app: 'StatusComplaintType' });

        let statusComplaintTypeList = [];
        [
            statusComplaintTypeList,   // 0
        ] = await Promise.all([
            statusComplaintTypeQuery,   // 0
        ]);

        console.log("Status Complaint List: ", statusComplaintTypeList);
        this.vm.initializeStatusComplaintType(statusComplaintTypeList);

        this.vm.isLoading = false;
        this.vm.pageName = "addCompalintType";
    }

    async getEmployeeCompalintType(complaintTypeId, idx) {

        this.vm.isLoading = true;
        // this.vm.pageName = "";

        const employeeComplaintTypeQuery = new Query()
            .filter({ parentComplaintType: complaintTypeId })
            .getObjectList({ parent_support_app: 'EmployeeComplaintType' });

        let employeeComplaintTypeList = [];
        [
            employeeComplaintTypeList,   // 0
        ] = await Promise.all([
            employeeComplaintTypeQuery,   // 0
        ]);

        console.log("Employee Complaint List: ", employeeComplaintTypeList);
        this.vm.initializeEmployeeComplaintType(employeeComplaintTypeList, idx);

        this.vm.isLoading = false;
        // this.vm.pageName = "addCompalintType";
    }
}
