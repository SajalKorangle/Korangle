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
            .getObjectList({ parent_support_app: 'SchoolComplaintType' });

        const statusQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ parent_support_app: 'SchoolComplaintStatus' });

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
        this.vm.initializecomplaintTypeList(complaintTypeList);
        this.vm.initializeEmployeeList(employeeList);
        this.vm.isLoading = false;
    }  // Ends: initializeData()

    /* Add Status */
    async addStatus() {
        let statusObject = {};
        statusObject["name"] = this.vm.addStatusName;
        statusObject["parentSchool"] = this.vm.user.activeSchool.dbId;

        const response = await new Query().createObject({parent_support_app: 'SchoolComplaintStatus'}, statusObject);
        response["selected"] = false;
        this.vm.statusList.push(response);
        console.log("Status Added: ", response);
    }  // Ends: addStatus()

    /* Update Status */
    async updateStatus(statusObject) {
        await new Query().updateObject({parent_support_app: 'SchoolComplaintStatus'}, statusObject);
    }  // Ends: updateStatus()

    /* Delete Status */
    async deleteStatus(status) {

        this.vm.isLoading = true;

        let statusData = {
            id: status.id,
        };

        await new Query().filter(statusData).deleteObjectList({parent_support_app: 'SchoolComplaintStatus'});
        this.vm.isLoading = false;
    }  // Ends: deleteStatus()

    /* Add Status-ComplaintType */
    async addStatusComplaintType(statusComplaintTypeList) {
        const response = await new Query().createObjectList({parent_support_app: 'StatusComplaintType'}, statusComplaintTypeList);
        console.log("Status-Complaint Type: ", response);
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

        await new Query().filter(deleteData).deleteObjectList({parent_support_app: 'StatusComplaintType'});
    }  // Ends: deleteStatusComplaintType()

    /* Add Employee-ComplaintType */
    async addEmployeeComplaintType(employeeComplaintTypeList) {
        const response = await new Query().createObjectList({parent_support_app: 'EmployeeComplaintType'}, employeeComplaintTypeList);
        console.log("Employee-Complaint Type: ", response);
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

        await new Query().filter(deleteData).deleteObjectList({parent_support_app: 'EmployeeComplaintType'});
    }  // Ends: deleteEmployeeComplaintType()

    /* Add ComplaintType */
    async addCompalintType() {

        this.vm.isLoading = true;

        let complaintTypeObject = {};
        complaintTypeObject["name"] = this.vm.typeName;
        complaintTypeObject["defaultText"] = this.vm.defaultText;
        complaintTypeObject["parentSchoolComplaintStatusDefault"] = this.vm.defaultStatusId;
        complaintTypeObject["parentSchool"] = this.vm.user.activeSchool.dbId;

        const response = await new Query().createObject({parent_support_app: 'SchoolComplaintType'}, complaintTypeObject);
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
    }  // Ends: addCompalintType()

    /* Update ComplaintType */
    async updateCompalintType(complaintTypeObject) {

        this.vm.isLoading = true;

        /* Update Complaint Type */
        await new Query().updateObject({parent_support_app: 'SchoolComplaintType'}, complaintTypeObject);

        console.log("List: ", this.vm.applicableStatusList);
        console.log("Temp List: ", this.vm.applicableStatusTempList);

        this.vm.applicableStatusList.sort((a,b) => a.id - b.id);
        this.vm.applicableStatusTempList.sort((a,b) => a.id - b.id);

        console.log("List: ", this.vm.applicableStatusList);
        console.log("Temp List: ", this.vm.applicableStatusTempList);

        /* Get Create-ApplicableStatusList  &&  Delete-ApplicableStatusList */
        let deleteStatusComplaintList = [];
        let createStatusComplaintList = [];
        let n = this.vm.applicableStatusList.length, i = 0;
        let m = this.vm.applicableStatusTempList.length, j = 0;

        while (i < n && j < m) {
            if (this.vm.applicableStatusList[i].id != this.vm.applicableStatusTempList[j].id) {
                if (this.vm.applicableStatusList[i].id > this.vm.applicableStatusTempList[j].id) {
                    let statusComplaintTypeObject = {};
                    statusComplaintTypeObject["parentSchoolComplaintStatus"] = this.vm.applicableStatusTempList[j].id;
                    statusComplaintTypeObject["parentSchoolComplaintType"] = complaintTypeObject.id;
                    deleteStatusComplaintList.push(statusComplaintTypeObject);
                    j++;
                } else {
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

        console.log("Create List: ", createStatusComplaintList);
        console.log("Delete List: ", deleteStatusComplaintList);


        /* Add Status-ComplaintType */
        if (createStatusComplaintList.length) {
            this.addStatusComplaintType(createStatusComplaintList);
        }

        /* Delete Status-ComplaintType */
        if (deleteStatusComplaintList.length) {
            this.deleteStatusComplaintType(deleteStatusComplaintList);
        }

        let selectedEmployeeList = [];
        this.vm.selectedEmployeeList.forEach((employee) => {
            if (employee.selected) {
                selectedEmployeeList.push(employee);
            }
        });

        console.log("List: ", selectedEmployeeList);
        console.log("Temp List: ", this.vm.applicableEmployeeList);

        selectedEmployeeList.sort((a,b) => a.id - b.id);
        this.vm.applicableEmployeeList.sort((a,b) => a.id - b.id);

        console.log("List: ", selectedEmployeeList);
        console.log("Temp List: ", this.vm.applicableEmployeeList);

        /* Get Create-AddressToEmployeeList  &&  Delete-AddressToEmployeeList */
        let deleteEmployeeComplaintList = [];
        let createEmployeeComplaintList = [];
        n = selectedEmployeeList.length, i = 0;
        m = this.vm.applicableEmployeeList.length, j = 0;

        while (i < n && j < m) {
            if (selectedEmployeeList[i].id != this.vm.applicableEmployeeList[j].id) {
                if (selectedEmployeeList[i].id > this.vm.applicableEmployeeList[j].id) {
                    let employeeComplaintTypeObject = {};
                    employeeComplaintTypeObject["parentEmployee"] = this.vm.applicableEmployeeList[j].id;
                    employeeComplaintTypeObject["parentSchoolComplaintType"] = complaintTypeObject.id;
                    deleteEmployeeComplaintList.push(employeeComplaintTypeObject);
                    j++;
                } else {
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

        console.log("Create List: ", createEmployeeComplaintList);
        console.log("Delete List: ", deleteEmployeeComplaintList);

        /* Add Employee-ComplaintType */
        if(createEmployeeComplaintList.length) {
            this.addEmployeeComplaintType(createEmployeeComplaintList);
        }

        /* Delete Employee-ComplaintType */
        if(deleteEmployeeComplaintList.length) {
            this.deleteEmployeeComplaintType(deleteEmployeeComplaintList);
        }

        console.log("Editing Index: ", this.vm.editingCompalaintTypeIndex);
        this.vm.complaintTypeList[this.vm.editingCompalaintTypeIndex]["addressEmployeeList"] = selectedEmployeeList;
        this.vm.initializeComplaintTypeDetails();
        this.vm.pageName = "showTables";

        this.vm.isLoading = false;
    }  // Ends: updateCompalintType()

    /* Delete ComplaintType */
    async deleteCompalintType(complaintTypeObject) {
        this.vm.isLoading = true;

        const deleteCompalintType = {
            id: complaintTypeObject.id,
        };

        await new Query().filter(deleteCompalintType).deleteObjectList({ parent_support_app: 'SchoolComplaintType' });
        this.vm.isLoading = false;
    }  // Ends: deleteCompalintType()

    /* Get Status-ComplaintType */
    async getStatusCompalintType() {

        this.vm.isLoading = true;
        this.vm.pageName = "";

        const statusComplaintTypeQuery = new Query()
            .filter({ parentSchoolComplaintType: this.vm.editingComplaintTypeId })
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
    }  // Ends: getStatusCompalintType()

    /* Get Employee-ComplaintType */
    async getEmployeeCompalintType(complaintTypeId, idx) {

        console.log("Get Employee Complaint Type Called.");

        const employeeComplaintTypeQuery = new Query()
            .filter({ parentSchoolComplaintType: complaintTypeId })
            .getObjectList({ parent_support_app: 'EmployeeComplaintType' });

        let employeeComplaintTypeList = [];
        [
            employeeComplaintTypeList,   // 0
        ] = await Promise.all([
            employeeComplaintTypeQuery,   // 0
        ]);

        console.log("Employee Complaint List: getEmployeeCompalintType: ", employeeComplaintTypeList);
        this.vm.initializeEmployeeComplaintType(employeeComplaintTypeList, idx);
    }  // Ends: getEmployeeCompalintType()
}
