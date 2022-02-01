import { ManageComplaintsComponent } from './manage-complaints.component';
import { Query } from '@services/generic/query';

export class ManageComplaintsServiceAdapter {
    vm: ManageComplaintsComponent;

    constructor() { }

    initializeAdapter(vm: ManageComplaintsComponent): void {
        this.vm = vm;
    }

    /* Initialize Data */
    async initializeData() {

        this.vm.isLoading = true;

        let studentIdList = [];
        if(this.vm.user.section["student"] && this.vm.user.section["student"]["studentList"]) {
            this.vm.user.section.student.studentList.forEach((student) => {
                studentIdList.push(student.id);
            });
        }

        const student_full_profile_request_filter = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const student_section_filter = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        const complaint_filter = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentStudent__in: studentIdList,
        };

        const complaintTypeQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ parent_support_app: 'SchoolComplaintType' });

        // Employee Query: Employee List  &&  Total Available Records.
        const complaintQuery = new Query()
            .filter(complaint_filter)
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

        const commentQuery = new Query()
            .getObjectList({ parent_support_app: 'Comment' });

        let complaintList = [];
        let studentList = [];
        let studentSectionList = [];
        let statusList = [];
        let employeeList = [];
        let commentList = [];
        [
            complaintList,   // 0
            studentList,   // 1
            studentSectionList,   // 2
            this.vm.complaintTypeList,   // 3
            statusList,   // 4
            employeeList,   // 5
            commentList,   // 5
        ] = await Promise.all([
            complaintQuery,   // 0
            studentQuery,   // 1
            studentSectionQuery,   // 2
            complaintTypeQuery,   // 3
            statusQuery,   // 4
            employeeQuery,   // 5
            commentQuery,   // 5
        ]);

        this.vm.initializeStatusList(statusList);
        this.vm.initializeEmployeeList(employeeList);
        this.vm.initializeStudentFullProfileList(studentList, studentSectionList);
        this.vm.initializeComplaintList(complaintList);
        console.log("Complaint Type List: ", this.vm.complaintTypeList);
        console.log("Comments All: ", commentList);
        this.vm.isLoading = false;
    }  // Ends: initializeData()

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

    async getCommentComplaint(parentComplaint, idx) {
        this.vm.isLoading = true;

        const commentComplaintQuery = new Query()
            .filter({ parentComplaint: parentComplaint })
            .getObjectList({ parent_support_app: 'Comment' });

        let commentComplaintList = [];
        [
            commentComplaintList,   // 0
        ] = await Promise.all([
            commentComplaintQuery,   // 0
        ]);

        commentComplaintList.forEach((comment) => {
            let employeeId = comment["parentEmployee"];
            comment["parentEmployee"] = this.vm.getEmployee(employeeId);
        });
        console.log("Comment List: ", commentComplaintList);
        this.vm.complaintList[idx]["commentList"] = commentComplaintList;
        this.vm.isLoading = false;
    }

    async updateStatus() {
        // this.vm.isLoading = true;

        let complaintObject = {};
        complaintObject["id"] =  this.vm.openedComplaint.id;
        complaintObject["parentEmployee"] = this.vm.openedComplaint.parentEmployee;
        complaintObject["parentSchoolComplaintType"] = this.vm.openedComplaint.parentSchoolComplaintType.id;
        complaintObject["parentStudent"] = this.vm.openedComplaint.parentStudent.dbId;
        complaintObject["title"] = this.vm.openedComplaint.title;
        complaintObject["parentSchoolComplaintStatus"] = this.vm.defaultStatus.id;
        complaintObject["parentSchool"] = this.vm.user.activeSchool.dbId;

        const complaint = await new Query().updateObject({parent_support_app: 'Complaint'}, complaintObject);
        console.log("Updated Complaint: ", complaint);

        this.vm.openedComplaint["parentSchoolComplaintStatus"] = this.vm.defaultStatus;
        // this.vm.isLoading = false;
    }

    async addComplaintComment(complaint) {
        this.vm.isLoading = true;

        let commentObject = {};
        commentObject["parentEmployee"] = this.vm.NULL_CONSTANT;
        commentObject["parentStudent"] = complaint.parentStudent.dbId;
        commentObject["message"] = this.vm.commentMessage;
        commentObject["parentComplaint"] = complaint.id;

        const comment = await new Query().createObject({parent_support_app: 'Comment'}, commentObject);
        console.log("Comment: ", comment);

        let employeeId = comment["parentEmployee"];
        comment["parentEmployee"] = this.vm.getEmployee(employeeId);

        this.vm.commentMessage = "";
        this.vm.openedComplaint.commentList.push(comment);

        this.vm.isLoading = false;
    }

    async createComment(complaint) {
        this.vm.isLoading = true;

        let commentObject = {};
        commentObject["parentEmployee"] = this.vm.NULL_CONSTANT;
        commentObject["parentStudent"] = complaint.parentStudent;
        commentObject["message"] = this.vm.commentMessage;
        commentObject["parentComplaint"] = complaint.id;

        const comment = await new Query().createObject({parent_support_app: 'Comment'}, commentObject);
        console.log("Comment: ", comment);

        this.vm.commentMessage = "";
        this.vm.initializeComplaint(complaint);

        this.vm.isLoading = false;
    }

    async sendComplaint() {
        this.vm.isLoading = true;

        let complaintObject = {};
        complaintObject["parentEmployee"] = this.vm.NULL_CONSTANT;
        complaintObject["parentSchoolComplaintType"] = this.vm.complaintType.id;
        complaintObject["parentStudent"] = this.vm.complaintStudent.dbId;
        complaintObject["title"] = this.vm.complaintTitle;
        complaintObject["parentSchoolComplaintStatus"] = this.vm.complaintType.parentSchoolComplaintStatusDefault;
        complaintObject["parentSchool"] = this.vm.user.activeSchool.dbId;

        const complaint = await new Query().createObject({parent_support_app: 'Complaint'}, complaintObject);
        console.log("Complaint: ", complaint);
        // this.createComment(complaint);

        let commentObject = {};
        commentObject["parentEmployee"] = this.vm.NULL_CONSTANT;
        commentObject["parentStudent"] = complaint.parentStudent;
        commentObject["message"] = this.vm.commentMessage;
        commentObject["parentComplaint"] = complaint.id;

        const comment = await new Query().createObject({parent_support_app: 'Comment'}, commentObject);
        console.log("Comment: ", comment);

        this.vm.commentMessage = "";
        this.vm.initializeComplaint(complaint);

        this.vm.pageName = "list-of-complaints";
        this.vm.isLoading = false;
    }
}
