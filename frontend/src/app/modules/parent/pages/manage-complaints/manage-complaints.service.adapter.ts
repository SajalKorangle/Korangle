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

        const complaintQuery = new Query()
            .filter(complaint_filter)
            .orderBy("-dateSent")
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
            employeeList,   // 5
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
        console.log("Complaint Type List: ", this.vm.complaintTypeList);
        this.vm.isLoading = false;
    }  // Ends: initializeData()

    /* Get Comments of Complaint */
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
            comment["parentEmployee"] = this.vm.getEmployee(comment["parentEmployee"]);
            comment["parentStudent"] = this.vm.getParentStudent(comment["parentStudent"]);
        });
        console.log("Comment List: ", commentComplaintList);
        this.vm.complaintList[idx]["commentList"] = commentComplaintList;

        this.vm.isLoading = false;
    }  // Ends: getCommentComplaint()

    /* Get Status of Complaint Type */
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

    /* Update Status of a Complaint */
    async updateStatus() {

        let complaintObject = {};
        complaintObject["id"] =  this.vm.openedComplaint.id;
        complaintObject["parentEmployee"] = this.vm.openedComplaint.parentEmployee.id;
        complaintObject["parentSchoolComplaintType"] = this.vm.openedComplaint.parentSchoolComplaintType.id;
        complaintObject["parentStudent"] = this.vm.openedComplaint.parentStudent.dbId;
        complaintObject["title"] = this.vm.openedComplaint.title;
        complaintObject["parentSchoolComplaintStatus"] = this.vm.defaultStatus.id;
        complaintObject["parentSchool"] = this.vm.user.activeSchool.dbId;

        const complaint = await new Query().updateObject({parent_support_app: 'Complaint'}, complaintObject);
        console.log("Updated Complaint: ", complaint);

        this.vm.openedComplaint["parentSchoolComplaintStatus"] = this.vm.defaultStatus;
    }  // Ends: updateStatus()

    /* Add Comment */
    async addComplaintComment() {
        this.vm.isLoading = true;

        let commentObject = {};
        commentObject["parentEmployee"] = this.vm.NULL_CONSTANT;
        commentObject["parentStudent"] = this.vm.openedComplaint.parentStudent.dbId;
        commentObject["message"] = this.vm.commentMessage;
        commentObject["parentComplaint"] = this.vm.openedComplaint.id;

        const comment = await new Query().createObject({parent_support_app: 'Comment'}, commentObject);
        console.log("Comment: ", comment);

        comment["parentEmployee"] = this.vm.getEmployee(comment["parentEmployee"]);
        comment["parentStudent"] = this.vm.getParentStudent(comment["parentStudent"]);

        this.vm.openedComplaint.commentList.push(comment);
        this.vm.commentMessage = "";

        this.vm.isLoading = false;
    }  // Ends: addComplaintComment()

    /* Send Complaint */
    async sendComplaint() {
        this.vm.isLoading = true;

        let complaintObject = {};
        complaintObject["parentEmployee"] = this.vm.NULL_CONSTANT;

        if(this.vm.complaintType["id"]) {
            complaintObject["parentSchoolComplaintType"] = this.vm.complaintType.id;
        } else {
            complaintObject["parentSchoolComplaintType"] = this.vm.NULL_CONSTANT;
        }

        if(this.vm.complaintType["parentSchoolComplaintStatusDefault"]) {
            complaintObject["parentSchoolComplaintStatus"] = this.vm.complaintType.parentSchoolComplaintStatusDefault;
        } else {
            complaintObject["parentSchoolComplaintStatus"] = this.vm.NULL_CONSTANT;
        }

        complaintObject["parentStudent"] = this.vm.complaintStudent.dbId;
        complaintObject["title"] = this.vm.complaintTitle;
        complaintObject["parentSchool"] = this.vm.user.activeSchool.dbId;

        const complaint = await new Query().createObject({parent_support_app: 'Complaint'}, complaintObject);
        console.log("Complaint: ", complaint);

        if(this.vm.commentMessage) {
            let commentObject = {};
            commentObject["parentEmployee"] = this.vm.NULL_CONSTANT;
            commentObject["parentStudent"] = this.vm.complaintStudent.dbId;
            commentObject["message"] = this.vm.commentMessage;
            commentObject["parentComplaint"] = complaint.id;
            const comment = await new Query().createObject({parent_support_app: 'Comment'}, commentObject);
            console.log("Comment: ", comment);
        }

        this.vm.commentMessage = "";
        this.vm.initializeComplaintList([complaint]);

        this.vm.pageName = "list-of-complaints";
        this.vm.isLoading = false;
    }  // Ends: sendComplaint()

    /* Delete Complaint */
    async deleteComplaint(complaintID) {

        this.vm.isLoading = true;

        const deleteData = {
            id: complaintID,
        };

        await new Query().filter(deleteData).deleteObjectList({parent_support_app: 'Complaint'});

        this.vm.isLoading = false;
    }  // Ends: deleteComplaint()

    /* Refresh Complaint */
    async refreshComplaint() {

        this.vm.isLoading = true;

        const complaintQuery = new Query()
            .filter({ id: this.vm.openedComplaint.id })
            .getObjectList({ parent_support_app: 'Complaint' });

        let complaintList = [];
        [
            complaintList,   // 0
        ] = await Promise.all([
            complaintQuery,   // 0
        ]);

        let complaintObject = complaintList[0];
        this.vm.openedComplaint["parentSchoolComplaintType"] = this.vm.getParentComplaint(complaintObject["parentSchoolComplaintType"]);
        this.vm.openedComplaint["id"] = complaintObject["id"];
        this.vm.openedComplaint["dateSent"] = complaintObject["dateSent"];
        this.vm.openedComplaint["parentEmployee"] = this.vm.getEmployee(complaintObject["parentEmployee"]);
        this.vm.openedComplaint["applicableStatusList"] = [];
        this.vm.openedComplaint["commentList"] = [];
        this.vm.openedComplaint["parentStudent"] = this.vm.getParentStudent(complaintObject["parentStudent"]);
        this.vm.openedComplaint["title"] = complaintObject["title"];
        this.vm.openedComplaint["parentSchoolComplaintStatus"] = this.vm.getStatus(complaintObject["parentSchoolComplaintStatus"]);


        let idx = this.vm.getComplaintIdx(this.vm.openedComplaint);
        this.getCommentComplaint(this.vm.openedComplaint["id"], idx);
        if(this.vm.openedComplaint["parentSchoolComplaintType"]["id"]) {
            this.getStatusCompalintType(this.vm.openedComplaint["parentSchoolComplaintType"].id, idx);
        }

        console.log("Refreshed Complaint: ", this.vm.openedComplaint);
        this.vm.isLoading = false;
    }  // Ends: refreshComplaint()
}
