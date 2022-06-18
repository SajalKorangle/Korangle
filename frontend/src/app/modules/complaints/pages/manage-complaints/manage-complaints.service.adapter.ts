import { ManageComplaintsComponent } from './manage-complaints.component';
import { Query } from '@services/generic/query';


export class ManageComplaintsServiceAdapter {
    vm: ManageComplaintsComponent;

    constructor() { }

    /* Initialize Adapter */
    initializeAdapter(vm: ManageComplaintsComponent): void {
        this.vm = vm;
    }  // Ends: initializeAdapter()

    /* Initialize Data */
    async initializeData() {

        this.vm.isLoading = true;

        const student_full_profile_request_filter = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const student_section_filter = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        const employee_permission_filter = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
            parentTask: this.getParentTask(),
        };


        const complaintTypeQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ complaints_app: 'SchoolComplaintType' });

        const studentQuery = new Query()
            .filter(student_full_profile_request_filter)
            .getObjectList({student_app: 'Student'});

        const studentSectionQuery = new Query()
            .filter(student_section_filter)
            .getObjectList({student_app: 'StudentSection'});

        const statusQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ complaints_app: 'SchoolComplaintStatus' });

        const employeeQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ employee_app: 'Employee' });

        const employeePermissionQuery = new Query()
            .filter(employee_permission_filter)
            .getObject({ employee_app: 'EmployeePermission' });


        let studentList = [];
        let complaintTypeList = [];
        let studentSectionList = [];
        let statusList = [];
        let employeeList = [];
        let employeePermissionObject = {};
        [
            studentList,   // 0
            studentSectionList,   // 1
            complaintTypeList,   // 2
            statusList,   // 3
            employeeList,   // 4
            employeePermissionObject,   // 5
        ] = await Promise.all([
            studentQuery,   // 0
            studentSectionQuery,   // 1
            complaintTypeQuery,   // 2
            statusQuery,   // 3
            employeeQuery,   // 4
            employeePermissionQuery,   // 5
        ]);

        this.vm.initializeStatusList(statusList);
        this.vm.initializeEmployeeList(employeeList);
        this.vm.initializeStudentFullProfileList(studentList, studentSectionList);
        this.vm.initializeComplaintTypeList(complaintTypeList);
        this.vm.checkUserPermission(employeePermissionObject);
        this.vm.isLoading = false;
    }  // Ends: initializeData()

    async initializeComplaintDataAdmin() {
        this.vm.isLoading = true;

        let complaint_filter = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const complaintQuery = new Query()
            .filter(complaint_filter)
            .orderBy("-dateSent")
            .paginate(Math.max(0, this.vm.startNumber - 1), this.vm.endNumber)
            .getObjectList({ complaints_app: 'Complaint' });


        let complaintList = [];
        [
            complaintList,   // 0
        ] = await Promise.all([
            complaintQuery,   // 0
        ]);


        this.vm.initializeComplaintList(complaintList);
        this.vm.isLoading = false;
    }

    /* Initialize Complaint Data */
    async initializeComplaintDataEmployee() {
        this.vm.isLoading = true;

        /* Get Assigned EmployeeComplaint */
        const employeeComplaintQuery = new Query()
            .filter({ parentEmployee: this.vm.user.activeSchool.employeeId })
            .paginate(Math.max(0, this.vm.startNumber - 1), this.vm.endNumber)
            .getObjectList({ complaints_app: 'EmployeeComplaint' });

        let employeeComplaintList = [];
        [
            employeeComplaintList,   // 0
        ] = await Promise.all([
            employeeComplaintQuery,   // 0
        ]);

        let complaintIdList = [];
        employeeComplaintList.forEach((employeeComplaint) => {
            complaintIdList.push(employeeComplaint.parentComplaint);
        });


        /* Get Assigned Complaints */
        let complaint_filter = {
            parentSchool: this.vm.user.activeSchool.dbId,
            id__in: complaintIdList,
        };

        const complaintQuery = new Query()
            .filter(complaint_filter)
            .orderBy("-dateSent")
            .getObjectList({ complaints_app: 'Complaint' });


        let complaintList = [];
        [
            complaintList,   // 0
        ] = await Promise.all([
            complaintQuery,   // 0
        ]);


        this.vm.initializeComplaintList(complaintList);
        this.vm.isLoading = false;
    }  // Ends: initializeComplaintData()

    /* Get Parent Task */
    getParentTask() {
        let moduleList = this.vm.user.activeSchool.moduleList;
        for (let i = 0; i < moduleList.length; i++) {
            if (moduleList[i].path == this.vm.user.section.route) {
                let taskList = moduleList[i].taskList;
                for (let j = 0; j < taskList.length; j++) {
                    if (taskList[j].path == this.vm.user.section.subRoute) {
                        return taskList[j].dbId;
                    }
                }
            }
        }

        return 0;
    }  // Ends: getParentTask()

    /* Get Comments of Complaint */
    async getCommentComplaint(parentComplaint, idx) {

        this.vm.isLoading = true;

        const commentQuery = new Query()
            .filter({ parentComplaint: parentComplaint })
            .getObjectList({ complaints_app: 'Comment' });

        let commentList = [];
        [
            commentList,   // 0
        ] = await Promise.all([
            commentQuery,   // 0
        ]);

        commentList.forEach((comment) => {
            comment["parentEmployee"] = this.vm.getEmployee(comment["parentEmployee"]);
            comment["parentStudent"] = this.vm.getParentStudent(comment["parentStudent"]);
        });

        if (this.vm.complaintList && this.vm.complaintList.length > 0) {
            this.vm.complaintList[idx]["commentList"] = commentList;
        }

        this.vm.isLoading = false;
    }  // Ends: getCommentComplaint()

    /* Get Status-ComplaintType */
    async getStatusCompalintType(parentSchoolComplaintType, idx) {

        this.vm.isLoading = true;

        const statusComplaintTypeQuery = new Query()
            .filter({ parentSchoolComplaintType: parentSchoolComplaintType })
            .getObjectList({ complaints_app: 'StatusComplaintType' });

        let statusComplaintTypeList = [];
        [
            statusComplaintTypeList,   // 0
        ] = await Promise.all([
            statusComplaintTypeQuery,   // 0
        ]);

        let applicableStatusList = [];
        statusComplaintTypeList.forEach((statusComplaintType) => {
            let status = this.vm.getStatus(statusComplaintType.parentSchoolComplaintStatus);
            applicableStatusList.push(status);
        });

        if (this.vm.complaintList && this.vm.complaintList.length > 0) {
            this.vm.complaintList[idx]["applicableStatusList"] = applicableStatusList;
        }
        this.vm.isLoading = false;
    }  // Ends: getStatusCompalintType()

    /* Get Employee-Complaint */
    async getEmployeeCompalint(complaintId, idx) {

        const employeeComplaintQuery = new Query()
            .filter({ parentComplaint: complaintId })
            .getObjectList({ complaints_app: 'EmployeeComplaint' });

        let employeeComplaintList = [];
        [
            employeeComplaintList,   // 0
        ] = await Promise.all([
            employeeComplaintQuery,   // 0
        ]);

        this.vm.initializeEmployeeComplaintList(employeeComplaintList, idx);
    }  // Ends: getEmployeeCompalint()

    /* Update Status */
    async updateStatus() {
        this.vm.isLoading = true;

        let complaintObject = {};
        complaintObject["id"] =  this.vm.openedComplaint.id;
        complaintObject["parentEmployee"] = this.vm.openedComplaint.parentEmployee.id;
        complaintObject["parentSchoolComplaintType"] = this.vm.openedComplaint.parentSchoolComplaintType.id;
        complaintObject["parentStudent"] = this.vm.openedComplaint.parentStudent.dbId;
        complaintObject["title"] = this.vm.openedComplaint.title;
        complaintObject["parentSchoolComplaintStatus"] = this.vm.defaultStatus.id;
        complaintObject["parentSchool"] = this.vm.user.activeSchool.dbId;

        const complaint = await new Query().updateObject({complaints_app: 'Complaint'}, complaintObject);

        this.vm.openedComplaint["parentSchoolComplaintStatus"] = this.vm.defaultStatus;
        alert("Status updated successfully.");
        this.vm.isLoading = false;
    }  // Ends: updateStatus()

    /* Add Comment */
    async addComment() {
        this.vm.isLoading = true;

        let commentObject = {};
        commentObject["parentEmployee"] = this.vm.user.activeSchool.employeeId;
        commentObject["parentStudent"] = this.vm.openedComplaint.parentStudent.dbId;
        commentObject["message"] = this.vm.commentMessage;
        commentObject["parentComplaint"] = this.vm.openedComplaint.id;

        const comment = await new Query().createObject({complaints_app: 'Comment'}, commentObject);

        let employeeId = comment["parentEmployee"];
        comment["parentEmployee"] = this.vm.getEmployee(employeeId);

        this.vm.commentList.push(comment);
        this.vm.commentMessage = "";
        this.vm.isLoading = false;
    }  // Ends: addComment()

    /* Delete Complaint */
    async deleteComplaint(complaint) {

        let deleteData = {
            id: complaint.id,
        };

        await new Query().filter(deleteData).deleteObjectList({complaints_app: 'Complaint'});
        this.vm.complaintList.splice(this.vm.openedComplaintIdx, 1);
        alert("Complaint deleted successfully.");
        this.vm.pageName = "showTables";
    }  // Ends: deleteComplaint()

    /* Load Complaints */
    async loadComplaints() {

        this.vm.isLoading = true;

        let filterData = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        /* Status Id Check */
        let statusList = [];
        let isStatusNull = false;
        this.vm.statusList.forEach((status) => {
            if (status.selected) {
                if (status.id) {
                    statusList.push(status.id);
                } else {
                    isStatusNull = true;
                }
            }
        });
        if (isStatusNull) {
            let parentSchoolStatusList = [];

            parentSchoolStatusList.push({"parentSchoolComplaintStatus__isnull": true});
            if (statusList.length) {
                parentSchoolStatusList.push({"parentSchoolComplaintStatus__in": statusList});
            }
            filterData["__or__parentSchoolComplaintStatus"] = parentSchoolStatusList;
        } else if (statusList.length) {
            filterData["parentSchoolComplaintStatus__in"] = statusList;
        }

        /* Complaint Type Id Check */
        let complaintTypeList = [];
        let isComplaintTypeNull = false;
        this.vm.complaintTypeList.forEach((complaintType) => {
            if (complaintType.selected) {
                if (complaintType.id) {
                    complaintTypeList.push(complaintType.id);
                } else {
                    isComplaintTypeNull = true;
                }
            }
        });
        if (isComplaintTypeNull) {
            let parentSchoolComplaintTypeList = [];

            parentSchoolComplaintTypeList.push({"parentSchoolComplaintType__isnull": true});
            if (complaintTypeList.length) {
                parentSchoolComplaintTypeList.push({"parentSchoolComplaintType__in": complaintTypeList});
            }
            filterData["__or__parentSchoolComplaintType"] = parentSchoolComplaintTypeList;
        } else if (complaintTypeList.length) {
            filterData["parentSchoolComplaintType__in"] = complaintTypeList;
        }

        /* Search Check */
        if (this.vm.searchString) {
            let searchList = [];
            searchList.push({"parentStudent__name__icontains": this.vm.searchString});
            searchList.push({"parentStudent__fathersName__icontains": this.vm.searchString});
            searchList.push({"title__icontains": this.vm.searchString});
            filterData["__or__searchList"] = searchList;
        }

        /* User Permission Check */
        if (!this.vm.userPermission) {
            /* Get Assigned Complaint */
            const employeeComplaintQuery = new Query()
                .filter({ parentEmployee: this.vm.user.activeSchool.employeeId })
                .getObjectList({ complaints_app: 'EmployeeComplaint' });

            let employeeComplaintList = [];
            [
                employeeComplaintList,   // 0
            ] = await Promise.all([
                employeeComplaintQuery,   // 0
            ]);

            let complaintIdList = [];
            employeeComplaintList.forEach((employeeComplaint) => {
                complaintIdList.push(employeeComplaint.parentComplaint);
            });
            filterData["id__in"] = complaintIdList;
        }

        this.vm.isProgress = true;

        const complaintQuery = new Query()
            .filter(filterData)
            .orderBy(this.vm.sortType)
            .paginate(Math.max(0, this.vm.startNumber - 1), this.vm.endNumber)
            .getObjectList({ complaints_app: 'Complaint' });


        let complaintList = [];
        [
            complaintList,   // 0
        ] = await Promise.all([
            complaintQuery,   // 0
        ]);

        if (this.vm.isLoadMoreClicked) this.vm.addNewComplaints(complaintList);
        else this.vm.initializeComplaintList(complaintList);

        this.vm.isLoadMoreClicked = false;
        this.vm.isLoading = false;
    }  // Ends: loadComplaints()

    async addNewAndRemoveEmployee(complaintId, idx, newlyAssignedEmployeeList, removeEmployeeList) {
        this.vm.isLoading = true;

        if (newlyAssignedEmployeeList.length > 0) {
            await new Query().createObjectList({complaints_app: 'EmployeeComplaint'}, newlyAssignedEmployeeList);
        }

        if (removeEmployeeList.length > 0) {
            let deleteData = {};
            deleteData["parentComplaint"] = complaintId;
            deleteData["parentEmployee__in"] = removeEmployeeList;
            await new Query().filter(deleteData).deleteObjectList({complaints_app: 'EmployeeComplaint'});
        }

        this.getEmployeeCompalint(complaintId, idx);
        this.vm.isLoading = false;
    }
}
