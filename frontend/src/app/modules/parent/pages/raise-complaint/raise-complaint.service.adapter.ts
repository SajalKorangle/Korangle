import { RaiseComplaintComponent } from './raise-complaint.component';
import { Query } from '@services/generic/query';

export class RaiseComplaintServiceAdapter {
    vm: RaiseComplaintComponent;

    constructor() { }

    /* Initialize Adapter */
    initializeAdapter(vm: RaiseComplaintComponent): void {
        this.vm = vm;
    }  // Ends: initializeAdapter()

    /* Initialize Data */
    async initializeData() {

        this.vm.isLoading = true;

        let studentIdList = [];
        if (this.vm.user.section["student"] && this.vm.user.section["student"]["studentList"]) {
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
            .getObjectList({ complaints_app: 'SchoolComplaintType' });

        const complaintQuery = new Query()
            .filter(complaint_filter)
            .orderBy("-dateSent")
            .getObjectList({ complaints_app: 'Complaint' });

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
        this.vm.isLoading = false;
    }  // Ends: initializeData()

    /* Get Comments of Complaint */
    async getCommentComplaint(parentComplaint, idx) {
        this.vm.isLoading = true;

        const commentComplaintQuery = new Query()
            .filter({ parentComplaint: parentComplaint })
            .getObjectList({ complaints_app: 'Comment' });

        let commentComplaintList = [];
        [
            commentComplaintList,   // 0
        ] = await Promise.all([
            commentComplaintQuery,   // 0
        ]);

        /* Starts: Initialize Complaint Comment Data */
        commentComplaintList.forEach((comment) => {
            comment["parentEmployee"] = this.vm.getEmployee(comment["parentEmployee"]);
            comment["parentStudent"] = this.vm.getParentStudent(comment["parentStudent"]);
        });
        this.vm.complaintList[idx]["commentList"] = commentComplaintList;
        /* Ends: Initialize Complaint Comment Data */

        this.vm.isLoading = false;
    }  // Ends: getCommentComplaint()

    /* Get Status of Complaint Type */
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

        this.vm.complaintList[idx]["applicableStatusList"] = applicableStatusList;
        this.vm.isLoading = false;
    }  // Ends: getStatusCompalintType()

    /* Update Status of a Complaint */
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
    async addComplaintComment() {
        this.vm.isLoading = true;

        let commentObject = {};
        commentObject["parentEmployee"] = this.vm.NULL_CONSTANT;
        commentObject["parentStudent"] = this.vm.openedComplaint.parentStudent.dbId;
        commentObject["message"] = this.vm.commentMessage;
        commentObject["parentComplaint"] = this.vm.openedComplaint.id;

        const comment = await new Query().createObject({complaints_app: 'Comment'}, commentObject);

        comment["parentEmployee"] = this.vm.getEmployee(comment["parentEmployee"]);
        comment["parentStudent"] = this.vm.getParentStudent(comment["parentStudent"]);

        this.vm.openedComplaint.commentList.push(comment);
        this.vm.commentMessage = "";

        this.vm.isLoading = false;
    }  // Ends: addComplaintComment()

    /* Assigned a Complaint to Employees */
    async assignEmployeeComplaint(employeeComplaintList) {
        const response = await new Query().createObjectList({complaints_app: 'EmployeeComplaint'}, employeeComplaintList);
    }  // Ends: assignEmployeeComplaint()

    /* Send Complaint */
    async sendComplaint() {
        this.vm.isLoading = true;

        /* Starts: Get Assigned Employees */
        let employeeComplaintTypeList = [];
        if (this.vm.complaintType["id"]) {

            const employeeComplaintTypeQuery = new Query()
                .filter({ parentSchoolComplaintType: this.vm.complaintType["id"] })
                .getObjectList({ complaints_app: 'EmployeeComplaintType' });


            [
                employeeComplaintTypeList,   // 0
            ] = await Promise.all([
                employeeComplaintTypeQuery,   // 0
            ]);
        }
        /* Ends: Get Assigned Employees */

        let complaintObject = {};
        complaintObject["parentEmployee"] = this.vm.NULL_CONSTANT;

        if (this.vm.complaintType["id"]) {
            complaintObject["parentSchoolComplaintType"] = this.vm.complaintType.id;
            complaintObject["parentSchoolComplaintStatus"] = this.vm.complaintType.parentSchoolComplaintStatusDefault;
        } else {
            complaintObject["parentSchoolComplaintType"] = this.vm.NULL_CONSTANT;
            complaintObject["parentSchoolComplaintStatus"] = this.vm.NULL_CONSTANT;
        }

        complaintObject["parentStudent"] = this.vm.complaintStudent.dbId;
        complaintObject["title"] = this.vm.complaintTitle;
        complaintObject["parentSchool"] = this.vm.user.activeSchool.dbId;

        const complaint = await new Query().createObject({complaints_app: 'Complaint'}, complaintObject);

        if (this.vm.commentMessage) {
            let commentObject = {};
            commentObject["parentEmployee"] = this.vm.NULL_CONSTANT;
            commentObject["parentStudent"] = this.vm.complaintStudent.dbId;
            commentObject["message"] = this.vm.commentMessage.toString().trim();
            commentObject["parentComplaint"] = complaint.id;

            const comment = await new Query().createObject({complaints_app: 'Comment'}, commentObject);
        }

        this.vm.commentMessage = "";
        this.vm.addNewComplaint(complaint);
        this.vm.initializeComplaintData();
        this.vm.pageName = "list-of-complaints";
        alert("Complaint sent successfully.");
        this.vm.isLoading = false;
    }  // Ends: sendComplaint()

    /* Delete Complaint */
    async deleteComplaint(complaintID) {

        this.vm.isLoading = true;

        const deleteData = {
            id: complaintID,
        };

        await new Query().filter(deleteData).deleteObjectList({complaints_app: 'Complaint'});
        alert("Complaint deleted successfully.");
        this.vm.isLoading = false;
    }  // Ends: deleteComplaint()

    /* Refresh Complaint */
    async refreshComplaint() {

        this.vm.isLoading = true;

        let complaintIdx = this.vm.getComplaintIdx(this.vm.openedComplaint["id"]);

        let refreshedComplaint = {};
        const complaint = await new Query().filter({id: this.vm.openedComplaint["id"]}).getObject({complaints_app: 'Complaint'});


        refreshedComplaint["dateSent"] = complaint["dateSent"];
        refreshedComplaint["id"] = complaint["id"];
        refreshedComplaint["employeeComplaintList"] = [];
        refreshedComplaint["applicableStatusList"] = [];
        refreshedComplaint["commentList"] = [];
        refreshedComplaint["parentEmployee"] = this.vm.getEmployee(complaint["parentEmployee"]);
        refreshedComplaint["parentSchoolComplaintStatus"] = this.vm.getStatus(complaint["parentSchoolComplaintStatus"]);
        refreshedComplaint["parentSchoolComplaintType"] = this.vm.getParentComplaintType(complaint["parentSchoolComplaintType"]);
        refreshedComplaint["parentStudent"] = this.vm.getParentStudent(complaint["parentStudent"]);
        refreshedComplaint["title"] = complaint["title"];


        /* Starts: refresh commentList */
        let commentComplaintList = await new Query()
            .filter({ parentComplaint: this.vm.openedComplaint["id"] })
            .getObjectList({ complaints_app: 'Comment' });


        commentComplaintList.forEach((comment) => {
            comment["parentEmployee"] = this.vm.getEmployee(comment["parentEmployee"]);
            comment["parentStudent"] = this.vm.getParentStudent(comment["parentStudent"]);
        });

        refreshedComplaint["commentList"] = commentComplaintList;
        /* Ends: refresh commentList */


        /* Starts: refresh applicable-statusList */
        if (refreshedComplaint["parentSchoolComplaintType"]["id"]) {
            let statusComplaintTypeList = await new Query()
                .filter({ parentSchoolComplaintType: this.vm.openedComplaint["parentSchoolComplaintType"].id })
                .getObjectList({ complaints_app: 'StatusComplaintType' });


            let applicableStatusList = [];
            statusComplaintTypeList.forEach((statusComplaintType) => {
                let status = this.vm.getStatus(statusComplaintType.parentSchoolComplaintStatus);
                applicableStatusList.push(status);
            });

            refreshedComplaint["applicableStatusList"] = applicableStatusList;
        }
        /* Ends: refresh applicable-statusList */

        this.vm.openedComplaint = refreshedComplaint;
        this.vm.complaintList[complaintIdx] = refreshedComplaint;
        this.vm.pageName = "list-of-complaints";
        this.vm.openComplaint(this.vm.openedComplaint);
        this.vm.isLoading = false;
    }  // Ends: refreshComplaint()

    /* Send Notification */
    async sendNotification(parentEmployee) {

        const parentUserQuery = new Query()
            .filter({ username: parentEmployee["mobileNumber"] })
            .getObjectList({ user_app: 'User' });

        let parentUserList = [];
        [
            parentUserList,   // 0
        ] = await Promise.all([
            parentUserQuery,   // 0
        ]);

        let notificationObject = {};

        notificationObject["content"] = "Renotification for comlpaint " +
                                            this.vm.openedComplaint.title +
                                            " by " +
                                            this.vm.openedComplaint.parentStudent.fathersName;
        notificationObject["parentSchool"] = this.vm.user.activeSchool.dbId;
        notificationObject["parentUser"] = parentUserList[0].id;

        const notification = await new Query().createObject({notification_app: 'Notification'}, notificationObject);
    }  // Ends: sendNotification()

    /* Renotify Complaint */
    async renotifyComplaint() {

        const employeeComplaintQuery = new Query()
            .filter({ parentComplaint: this.vm.openedComplaint.id })
            .getObjectList({ complaints_app: 'EmployeeComplaint' });

        let employeeComplaintList = [];
        [
            employeeComplaintList,   // 0
        ] = await Promise.all([
            employeeComplaintQuery,   // 0
        ]);


        employeeComplaintList.forEach((employeeComplaint) => {
            let parentEmployee = this.vm.getEmployee(employeeComplaint.parentEmployee);
            this.sendNotification(parentEmployee);
        });
        alert("Renotified successfully.");
    }  // Ends: renotifyComplaint()
}
