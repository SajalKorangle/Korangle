import { AddComplaintComponent } from './add-complaint.component';
import { Query } from '@services/generic/query';

export class AddComplaintServiceAdapter {
    vm: AddComplaintComponent;

    constructor() { }

    initializeAdapter(vm: AddComplaintComponent): void {
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

        // Employee Query: Employee List  &&  Total Available Records.
        const complaintTypeQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ parent_support_app: 'SchoolComplaintType' });

        const studentQuery = new Query()
            .filter(student_full_profile_request_filter)
            .getObjectList({student_app: 'Student'});

        const studentSectionQuery = new Query()
            .filter(student_section_filter)
            .getObjectList({student_app: 'StudentSection'});

        let studentList = [];
        let studentSectionList = [];
        [
            this.vm.complaintTypeList,   // 0
            studentList,   // 1
            studentSectionList,   // 2
        ] = await Promise.all([
            complaintTypeQuery,   // 0
            studentQuery,   // 1
            studentSectionQuery,   // 2
        ]);

        this.vm.initializeStudentFullProfileList(studentList, studentSectionList);
        this.vm.isLoading = false;
    }  // Ends: initializeData()

    async addComplaint() {

        this.vm.isLoading = true;

        let complaintObject = {};
        complaintObject["parentEmployee"] = this.vm.user.activeSchool.employeeId;
        complaintObject["parentSchoolComplaintType"] = this.vm.complaintType.id;
        complaintObject["parentStudent"] = this.vm.selectedStudent.dbId;
        complaintObject["title"] = this.vm.complaintTitle;
        complaintObject["parentSchoolComplaintStatus"] = this.vm.complaintType.parentSchoolComplaintStatusDefault;
        complaintObject["parentSchool"] = this.vm.user.activeSchool.dbId;

        const complaint = await new Query().createObject({parent_support_app: 'Complaint'}, complaintObject);
        console.log("Complaint: ", complaint);

        if(this.vm.comment) {
            let commentObject = {};
            commentObject["parentEmployee"] = this.vm.NULL_CONSTANT;
            commentObject["parentStudent"] = this.vm.selectedStudent.dbId;
            commentObject["message"] = this.vm.comment;
            commentObject["parentComplaint"] = complaint.id;
            const comment = await new Query().createObject({parent_support_app: 'Comment'}, commentObject);
            console.log("Comment: ", comment);
        }

        this.vm.initializeComplaintData();
        this.vm.isLoading = false;
    }
}
