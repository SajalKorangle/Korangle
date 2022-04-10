import { ManageComplaintTypeComponent } from './manage-complaint-type.component';
import { Query } from '@services/generic/query';

export class ManageComplaintTypeServiceAdapter {
    vm: ManageComplaintTypeComponent;

    constructor() { }

    /* Initialize Adapter */
    initializeAdapter(vm: ManageComplaintTypeComponent): void {
        this.vm = vm;
    }  // Ends: initializeAdapter()

    /* Initialize Data */
    async initializeData() {

        this.vm.isLoading = true;

        const complaintTypeQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ complaints_app: 'SchoolComplaintType' });

        const statusQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ complaints_app: 'SchoolComplaintStatus' });

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

        this.vm.initializeStatusList(statusList);
        this.vm.initializeEmployeeList(employeeList);
        this.vm.initializecomplaintTypeList(complaintTypeList);
        this.vm.isLoading = false;
    }  // Ends: initializeData()

    /* Get Employee-ComplaintType */
    async getEmployeeComplaintType(complaintTypeId, idx) {

        const employeeComplaintTypeQuery = new Query()
            .filter({ parentSchoolComplaintType: complaintTypeId })
            .getObjectList({ complaints_app: 'EmployeeComplaintType' });

        let employeeComplaintTypeList = [];
        [
            employeeComplaintTypeList,   // 0
        ] = await Promise.all([
            employeeComplaintTypeQuery,   // 0
        ]);

        this.vm.initializeEmployeeComplaintType(employeeComplaintTypeList, idx);
    }  // Ends: getEmployeeComplaintType()

    /* Add Status */
    async addStatus() {
        this.vm.isLoading = true;

        let statusObject = {};
        statusObject["name"] = this.vm.addStatusName.toString().trim();
        statusObject["parentSchool"] = this.vm.user.activeSchool.dbId;

        const response = await new Query().createObject({complaints_app: 'SchoolComplaintStatus'}, statusObject);
        response["selected"] = false;
        this.vm.statusList.push(response);

        this.vm.addStatusName = "";
        this.vm.isLoading = false;
        alert("Status added successfully.");
    }  // Ends: addStatus()

    /* Update Status */
    async updateStatus(statusObject) {
        this.vm.isLoading = true;

        await new Query().updateObject({complaints_app: 'SchoolComplaintStatus'}, statusObject);

        this.vm.isLoading = false;
        alert("Status updated successfully.");
    }  // Ends: updateStatus()

    /* Delete Status */
    async deleteStatus(status, idx) {

        this.vm.isLoading = true;

        let statusData = {
            id: status.id,
        };

        await new Query().filter(statusData).deleteObjectList({complaints_app: 'SchoolComplaintStatus'});

        this.vm.statusList.splice(idx, 1);
        alert("Status deleted successfully.");
        this.vm.isLoading = false;
    }  // Ends: deleteStatus()

    /* Add Status-ComplaintType */
    async addStatusComplaintType(statusComplaintTypeList) {
        const response = await new Query().createObjectList({complaints_app: 'StatusComplaintType'}, statusComplaintTypeList);
    }  // Ends: addStatusComplaintType()

    /* Delete Status-ComplaintType */
    async deleteStatusComplaintType(statusComplaintTypeList) {

        let deleteStatusId = [];
        let deleteComplaintTypeId = [];

        statusComplaintTypeList.forEach((element) => {
            deleteStatusId.push(element["parentSchoolComplaintStatus"]);
            deleteComplaintTypeId.push(element["parentSchoolComplaintType"]);
        });

        const deleteData = {
            parentSchoolComplaintStatus__in: deleteStatusId,
            parentSchoolComplaintType__in: deleteComplaintTypeId,
        };

        await new Query().filter(deleteData).deleteObjectList({complaints_app: 'StatusComplaintType'});
    }  // Ends: deleteStatusComplaintType()

    /* Add Employee-ComplaintType */
    async addEmployeeComplaintType(employeeComplaintTypeList) {
        const response = await new Query().createObjectList({complaints_app: 'EmployeeComplaintType'}, employeeComplaintTypeList);
    }  // Ends: addEmployeeComplaintType()

    /* Delete Employee-ComplaintType */
    async deleteEmployeeComplaintType(employeeComplaintTypeList) {

        let deleteEmployeeId = [];
        let deleteComplaintTypeId = [];

        employeeComplaintTypeList.forEach((element) => {
            deleteEmployeeId.push(element["parentEmployee"]);
            deleteComplaintTypeId.push(element["parentSchoolComplaintType"]);
        });

        const deleteData = {
            parentEmployee__in: deleteEmployeeId,
            parentSchoolComplaintType__in: deleteComplaintTypeId,
        };

        await new Query().filter(deleteData).deleteObjectList({complaints_app: 'EmployeeComplaintType'});
    }  // Ends: deleteEmployeeComplaintType()

    /* Add ComplaintType */
    async addCompalintType() {

        this.vm.isLoading = true;

        let complaintTypeObject = {};
        complaintTypeObject["name"] = this.vm.typeName.toString().trim();
        complaintTypeObject["defaultText"] = this.vm.defaultText.toString().trim();
        complaintTypeObject["parentSchoolComplaintStatusDefault"] = this.vm.defaultStatusId;
        complaintTypeObject["parentSchool"] = this.vm.user.activeSchool.dbId;

        const response = await new Query().createObject({complaints_app: 'SchoolComplaintType'}, complaintTypeObject);
        response["parentSchoolComplaintStatusDefault"] = this.vm.getStatusFromId(this.vm.defaultStatusId);
        this.vm.complaintTypeList.push(response);

        /* Add Status-ComplaintType */
        let statusComplaintTypeList = [];
        this.vm.applicableStatusList.forEach((status) => {
            let statusComplaintTypeObject = {};
            statusComplaintTypeObject["parentSchoolComplaintStatus"] = status.id;
            statusComplaintTypeObject["parentSchoolComplaintType"] = response.id;
            statusComplaintTypeList.push(statusComplaintTypeObject);
        });
        if (statusComplaintTypeList.length) {
            this.addStatusComplaintType(statusComplaintTypeList);
        }

        /* Add Employee-ComplaintType */
        let employeeComplaintTypeList = [];
        this.vm.selectedEmployeeList.forEach((employee) => {
            if (employee.selected) {
                let employeeComplaintType = {};
                employeeComplaintType["parentEmployee"] = employee.id;
                employeeComplaintType["parentSchoolComplaintType"] = response.id;
                employeeComplaintTypeList.push(employeeComplaintType);
            }
        });
        if (employeeComplaintTypeList.length) {
            this.addEmployeeComplaintType(employeeComplaintTypeList);
        }

        /* Get Address-To-Employee List */
        this.vm.complaintTypeList[this.vm.complaintTypeList.length - 1]["addressEmployeeList"] = [];
        this.vm.selectedEmployeeList.forEach((employee) => {
            if (employee.selected) {
                this.vm.complaintTypeList[this.vm.complaintTypeList.length - 1]["addressEmployeeList"].push(employee);
            }
        });
        this.vm.initializeComplaintTypeDetails();
        this.vm.pageName = "showTables";

        this.vm.isLoading = false;
        alert("Complaint type added successfully.");
    }  // Ends: addCompalintType()

    /* Update ComplaintType */
    async updateCompalintType(complaintTypeObject) {

        this.vm.isLoading = true;

        /* Update Complaint Type */
        await new Query().updateObject({complaints_app: 'SchoolComplaintType'}, complaintTypeObject);

        /* Starts: Get Newly-Assigned-ApplicableStatusList  &&  Deleted-ApplicableStatusList */
        let deleteStatusComplaintList = [];
        let createStatusComplaintList = [];

        this.vm.applicableStatusList.sort((a,b) => a.id - b.id);   //  Assigned statusList.
        this.vm.applicableStatusTempList.sort((a,b) => a.id - b.id);   //  Previously assigned statusList.

        let n = this.vm.applicableStatusList.length, i = 0;
        let m = this.vm.applicableStatusTempList.length, j = 0;

            /* Starts: Algorithm - Merge 2 arrays */
        while (i < n && j < m) {
            if (this.vm.applicableStatusList[i].id != this.vm.applicableStatusTempList[j].id) {
                if (this.vm.applicableStatusList[i].id > this.vm.applicableStatusTempList[j].id) {   //  If current status is not in the Assigned statusList, delete it.
                    let statusComplaintTypeObject = {};
                    statusComplaintTypeObject["parentSchoolComplaintStatus"] = this.vm.applicableStatusTempList[j].id;
                    statusComplaintTypeObject["parentSchoolComplaintType"] = complaintTypeObject.id;
                    deleteStatusComplaintList.push(statusComplaintTypeObject);
                    j++;
                } else {   //  If current status is not in the Previously Assigned statusList, create it.
                    let statusComplaintTypeObject = {};
                    statusComplaintTypeObject["parentSchoolComplaintStatus"] = this.vm.applicableStatusList[i].id;
                    statusComplaintTypeObject["parentSchoolComplaintType"] = complaintTypeObject.id;
                    createStatusComplaintList.push(statusComplaintTypeObject);
                    i++;
                }
            } else {
                i++;
                j++;
            }
        }

        while (i < n) {
            let statusComplaintTypeObject = {};
            statusComplaintTypeObject["parentSchoolComplaintStatus"] = this.vm.applicableStatusList[i].id;
            statusComplaintTypeObject["parentSchoolComplaintType"] = complaintTypeObject.id;
            createStatusComplaintList.push(statusComplaintTypeObject);
            i++;
        }

        while (j < m) {
            let statusComplaintTypeObject = {};
            statusComplaintTypeObject["parentSchoolComplaintStatus"] = this.vm.applicableStatusTempList[j].id;
            statusComplaintTypeObject["parentSchoolComplaintType"] = complaintTypeObject.id;
            deleteStatusComplaintList.push(statusComplaintTypeObject);
            j++;
        }
            /* Ends: Algorithm - Merge 2 arrays */

            /* Add Status-ComplaintType */
        if (createStatusComplaintList.length) {
            this.addStatusComplaintType(createStatusComplaintList);
        }

            /* Delete Status-ComplaintType */
        if (deleteStatusComplaintList.length) {
            this.deleteStatusComplaintType(deleteStatusComplaintList);
        }
        /* Ends: Get Newly-Assigned-ApplicableStatusList  &&  Deleted-ApplicableStatusList */


        /* Starts: Get Create-AddressToEmployeeList  &&  Delete-AddressToEmployeeList */

        let selectedEmployeeList = [];   //  Assigned Employee.
        this.vm.selectedEmployeeList.forEach((employee) => {
            if (employee.selected) {
                selectedEmployeeList.push(employee);
            }
        });

        selectedEmployeeList.sort((a,b) => a.id - b.id);
        this.vm.applicableEmployeeList.sort((a,b) => a.id - b.id);   //  Previously assigned Employee.

        let deleteEmployeeComplaintList = [];
        let createEmployeeComplaintList = [];
        n = selectedEmployeeList.length, i = 0;
        m = this.vm.applicableEmployeeList.length, j = 0;

            /* Starts: Algorithm - Merge 2 arrays */
        while (i < n && j < m) {
            if (selectedEmployeeList[i].id != this.vm.applicableEmployeeList[j].id) {
                if (selectedEmployeeList[i].id > this.vm.applicableEmployeeList[j].id) {   //  If current employee is not in the Assigned employeeList, delete it.
                    let employeeComplaintTypeObject = {};
                    employeeComplaintTypeObject["parentEmployee"] = this.vm.applicableEmployeeList[j].id;
                    employeeComplaintTypeObject["parentSchoolComplaintType"] = complaintTypeObject.id;
                    deleteEmployeeComplaintList.push(employeeComplaintTypeObject);
                    j++;
                } else {   //  If current employee is not in the Previously Assigned employeeList, create it.
                    let employeeComplaintTypeObject = {};
                    employeeComplaintTypeObject["parentEmployee"] = selectedEmployeeList[i].id;
                    employeeComplaintTypeObject["parentSchoolComplaintType"] = complaintTypeObject.id;
                    createEmployeeComplaintList.push(employeeComplaintTypeObject);
                    i++;
                }
            } else {
                i++;
                j++;
            }
        }

        while (i < n) {
            let employeeComplaintTypeObject = {};
            employeeComplaintTypeObject["parentEmployee"] = selectedEmployeeList[i].id;
            employeeComplaintTypeObject["parentSchoolComplaintType"] = complaintTypeObject.id;
            createEmployeeComplaintList.push(employeeComplaintTypeObject);
            i++;
        }

        while (j < m) {
            let employeeComplaintTypeObject = {};
            employeeComplaintTypeObject["parentEmployee"] = this.vm.applicableEmployeeList[j].id;
            employeeComplaintTypeObject["parentSchoolComplaintType"] = complaintTypeObject.id;
            deleteEmployeeComplaintList.push(employeeComplaintTypeObject);
            j++;
        }
            /* Ends: Algorithm - Merge 2 arrays */

            /* Add Employee-ComplaintType */
        if (createEmployeeComplaintList.length) {
            this.addEmployeeComplaintType(createEmployeeComplaintList);
        }

            /* Delete Employee-ComplaintType */
        if (deleteEmployeeComplaintList.length) {
            this.deleteEmployeeComplaintType(deleteEmployeeComplaintList);
        }
        /* Ends: Get Create-AddressToEmployeeList  &&  Delete-AddressToEmployeeList */

        this.vm.complaintTypeList[this.vm.editingCompalaintTypeIndex]["addressEmployeeList"] = selectedEmployeeList;
        this.vm.initializeComplaintTypeDetails();
        this.vm.pageName = "showTables";

        this.vm.isLoading = false;
        alert("Complaint type updated successfully.");
    }  // Ends: updateCompalintType()

    /* Delete ComplaintType */
    async deleteCompalintType(complaintTypeObject, idx) {
        this.vm.isLoading = true;

        const deleteCompalintType = {
            id: complaintTypeObject.id,
        };

        await new Query().filter(deleteCompalintType).deleteObjectList({ complaints_app: 'SchoolComplaintType' });
        this.vm.complaintTypeList.splice(idx, 1);
        this.vm.isLoading = false;
        alert("Complaint type deleted successfully.");
    }  // Ends: deleteCompalintType()

    /* Get Status-ComplaintType */
    async getStatusCompalintType() {

        this.vm.isLoading = true;
        this.vm.pageName = "";

        const statusComplaintTypeQuery = new Query()
            .filter({ parentSchoolComplaintType: this.vm.editingComplaintTypeId })
            .getObjectList({ complaints_app: 'StatusComplaintType' });

        let statusComplaintTypeList = [];
        [
            statusComplaintTypeList,   // 0
        ] = await Promise.all([
            statusComplaintTypeQuery,   // 0
        ]);

        this.vm.initializeStatusComplaintType(statusComplaintTypeList);

        this.vm.isLoading = false;
        this.vm.pageName = "addCompalintType";
    }  // Ends: getStatusCompalintType()
}
