import { ManageAllComplaintsComponent } from './manage-all-complaints.component';
import { Query } from '@services/generic/query';

export class ManageAllComplaintsServiceAdapter {
    vm: ManageAllComplaintsComponent;

    constructor() { }

    initializeAdapter(vm: ManageAllComplaintsComponent): void {
        this.vm = vm;
    }

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

        const complaintTypeQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ parent_support_app: 'SchoolComplaintType' });

        // Employee Query: Employee List  &&  Total Available Records.
        const complaintQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ parent_support_app: 'Complaint' });

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

        let complaintList = [];
        let studentList = [];
        let studentSectionList = [];
        let statusList = [];
        let employeeList = [];
        [
            complaintList,   // 0
            studentList,   // 1
            studentSectionList,   // 2
            this.vm.complaintTypeList,   // 3
            statusList,   // 4
            employeeList,   // 4
        ] = await Promise.all([
            complaintQuery,   // 0
            studentQuery,   // 1
            studentSectionQuery,   // 2
            complaintTypeQuery,   // 3
            statusQuery,   // 4
            employeeQuery,   // 5
        ]);

        this.vm.initializeStatusList(statusList);
        this.vm.initializeEmployeeList(employeeList);
        this.vm.initializeStudentFullProfileList(studentList, studentSectionList);
        this.vm.initializeComplaintList(complaintList);
        this.vm.isLoading = false;
    }  // Ends: initializeData()

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
        this.vm.complaintList[idx]["commentList"] = commentList;

        this.vm.isLoading = false;
    }

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
    }

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
    }

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
    }

    async deleteComplaint(complaint) {

        let deleteData = {
            id: complaint.id,
        };

        await new Query().filter(deleteData).deleteObjectList({parent_support_app: 'Complaint'});
        this.vm.complaintList.splice(this.vm.openedComplaintIdx, 1);
    }
}
