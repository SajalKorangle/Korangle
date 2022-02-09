import { ManageAllComplaintsComponent } from './manage-all-complaints.component';
import { Query } from '@services/generic/query';

export class ManageAllComplaintsServiceAdapter {
    vm: ManageAllComplaintsComponent;

    constructor() { }

    /* Initialize Adapter */
    initializeAdapter(vm: ManageAllComplaintsComponent): void {
        this.vm = vm;
    }  // Ends: initializeAdapter()

    // setProgress(progress) {
    //     this.vm.setProgress(progress);
    // }

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
        }


        const complaintTypeQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ parent_support_app: 'SchoolComplaintType' });

        const studentQuery = new Query()
            .filter(student_full_profile_request_filter)
            .getObjectList({student_app: 'Student'});

        const studentSectionQuery = new Query()
            .filter(student_section_filter)
            .getObjectList({student_app: 'StudentSection'});

        const statusQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ parent_support_app: 'SchoolComplaintStatus' });

        const employeeQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ employee_app: 'Employee' });

        const employeePermissionQoery = new Query()
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
            employeePermissionQoery,   // 5
        ]);


        this.vm.initializeStatusList(statusList);
        this.vm.initializeComplaintTypeList(complaintTypeList);
        this.vm.initializeEmployeeList(employeeList);
        this.vm.initializeStudentFullProfileList(studentList, studentSectionList);
        this.vm.checkUserPermission(employeePermissionObject);
        this.vm.isLoading = false;
    }  // Ends: initializeData()

    /* Initialize Complaint Data */
    async initializeComplaintData() {
        this.vm.isLoading = true;

        /* Get Assigned Complaint Type */
        const employeeComplaintTypeQuery = new Query()
            .filter({ parentEmployee: this.vm.user.activeSchool.employeeId })
            .getObjectList({ parent_support_app: 'EmployeeComplaintType' });

        let employeeComplaintTypeList = [];
        [
            employeeComplaintTypeList,   // 0
        ] = await Promise.all([
            employeeComplaintTypeQuery,   // 0
        ]);


        this.vm.schoolComplaintTypeIdList = [];
        employeeComplaintTypeList.forEach((employeeComplaintType) => {
            this.vm.schoolComplaintTypeIdList.push(employeeComplaintType.parentSchoolComplaintType)
        });
        console.log("SchoolComplaintType: ", this.vm.schoolComplaintTypeIdList);


        /* Get Assigned Complaints */
        let complaint_filter = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        if (!this.vm.userPermission) {
            complaint_filter["parentSchoolComplaintType__in"] = this.vm.schoolComplaintTypeIdList;
        }

        const complaintQuery = new Query()
            .filter(complaint_filter)
            .orderBy("-dateSent")
            .paginate(Math.max(0, this.vm.startNumber - 1), this.vm.endNumber)
            .getObjectList({ parent_support_app: 'Complaint' });


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
            if (moduleList[i].path == "parent_support") {
                let taskList = moduleList[i].taskList;
                for (let j = 0; j < taskList.length; j++) {
                    if (taskList[j].path == "manage_all_complaints") {
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
            .getObjectList({ parent_support_app: 'Comment' });

        let commentList = [];
        [
            commentList,   // 0
        ] = await Promise.all([
            commentQuery,   // 0
        ]);

        console.log("Comment List: ", commentList);
        commentList.forEach((comment) => {
            comment["parentEmployee"] = this.vm.getEmployee(comment["parentEmployee"]);
            comment["parentStudent"] = this.vm.getParentStudent(comment["parentStudent"]);
        });
        this.vm.complaintList[idx]["commentList"] = commentList;

        this.vm.isLoading = false;
    }  // Ends: getCommentComplaint()

    /* Get Status-ComplaintType */
    async getStatusCompalintType(parentSchoolComplaintType, idx) {

        this.vm.isLoading = true;

        const statusComplaintTypeQuery = new Query()
            .filter({ parentSchoolComplaintType: parentSchoolComplaintType })
            .getObjectList({ parent_support_app: 'StatusComplaintType' });

        let statusComplaintTypeList = [];
        [
            statusComplaintTypeList,   // 0
        ] = await Promise.all([
            statusComplaintTypeQuery,   // 0
        ]);

        console.log("Status Complaint List: ", statusComplaintTypeList);
        let applicableStatusList = [];
        statusComplaintTypeList.forEach((statusComplaintType) => {
            let status = this.vm.getStatus(statusComplaintType.parentSchoolComplaintStatus);
            applicableStatusList.push(status);
        });

        this.vm.complaintList[idx]["applicableStatusList"] = applicableStatusList;
        this.vm.isLoading = false;
    }  // Ends: getStatusCompalintType()

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

        const complaint = await new Query().updateObject({parent_support_app: 'Complaint'}, complaintObject);
        console.log("Complaint: ", complaint);

        this.vm.openedComplaint["parentSchoolComplaintStatus"] = this.vm.defaultStatus;
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

        const comment = await new Query().createObject({parent_support_app: 'Comment'}, commentObject);
        console.log("Comment: ", comment);

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

        await new Query().filter(deleteData).deleteObjectList({parent_support_app: 'Complaint'});
        this.vm.complaintList.splice(this.vm.openedComplaintIdx, 1);
    }  // Ends: deleteComplaint()

    /* Load Complaints */
    async loadComplaints() {

        let filterData = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        /* Status Id Check */
        let statusList = [];
        this.vm.filterStatusList.forEach((status) => {
            if (status.selected) {
                statusList.push(status.id);
            }
        });
        if (statusList.length) {
            filterData["parentSchoolComplaintStatus__in"] = statusList;
        }

        /* Complaint Type Id Check */
        let complaintTypeList = [];
        this.vm.filterComplaintTypeList.forEach((complaintType) => {
            if (complaintType.selected) {
                complaintTypeList.push(complaintType.id);
            }
        });
        if (complaintTypeList.length) {
            filterData["parentSchoolComplaintType__in"] = complaintTypeList;
        }

        /* Search Check */
        if (this.vm.seachString) {
            let searchList = [];
            searchList.push({"parentStudent__name__icontains": this.vm.seachString});
            searchList.push({"parentStudent__fathersName__icontains": this.vm.seachString});
            searchList.push({"title__icontains": this.vm.seachString});
            filterData["__or__searchList"] = searchList;
        }

        /* User Permission Check */
        if (!this.vm.userPermission) {
            filterData["parentSchoolComplaintType__in"] = this.vm.schoolComplaintTypeIdList;
        }

        this.vm.isProgress = true;
        this.vm.progress = 0;

        console.log("Filter Data: ", filterData);

        const complaintQuery = new Query()
            .filter(filterData)
            .orderBy(this.vm.sortType)
            .paginate(Math.max(0, this.vm.startNumber - 1), this.vm.endNumber)
            .getObjectList({ parent_support_app: 'Complaint' });


        let complaintList = [];
        [
            complaintList,   // 0
        ] = await Promise.all([
            complaintQuery,   // 0
        ]);

        console.log("Filtered Status List: ", this.vm.filterStatusList);
        this.vm.initializeComplaintList(complaintList);
    }  // Ends: loadComplaints()
}
