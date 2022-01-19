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
            .getObjectList({ parent_support_app: 'ComplaintType' });

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

        let complainObject = {};
        complainObject["parentEmployee"] = this.vm.user.activeSchool.employeeId;
        complainObject["parentUser"] = this.vm.user.id;
        complainObject["parentComplaintType"] = this.vm.complaintType.id;
        complainObject["parentStudent"] = this.vm.selectedStudent.dbId;
        complainObject["title"] = this.vm.complaintTitle;
        complainObject["parentStatus"] = this.vm.NULL_CONSTANT;
        complainObject["parentSchool"] = this.vm.user.activeSchool.dbId;

        const complaint = await new Query().createObject({parent_support_app: 'Complaint'}, complainObject);
        console.log("Complaint: ", complaint);


        let commentObject = {};
        commentObject["parentEmployee"] = this.vm.user.activeSchool.employeeId;
        commentObject["parentUser"] = this.vm.user.id;
        commentObject["message"] = this.vm.user.id;
        commentObject["parentComplaint"] = complaint.id;

        const comment = await new Query().createObject({parent_support_app: 'Comment'}, commentObject);
        console.log("Comment: ", comment);

        this.vm.initializeComplaintData();
        this.vm.isLoading = false;
    }

    // async searchStudent() {
    //
    //     this.vm.isLoading = true;
    //
    //     // Employee Query: Employee List  &&  Total Available Records.
    //     const studentQuery = new Query()
    //         .filter({ parentSchool: this.vm.user.activeSchool.dbId, name__icontains: this.vm.seachStudentString })
    //         .getObjectList({ student_app: 'Student' });
    //
    //     [
    //         this.vm.searchedStudentList,   // 0
    //     ] = await Promise.all([
    //         studentQuery,   // 0
    //     ]);
    //
    //     console.log("Student List: ", this.vm.searchedStudentList);
    //     this.vm.isLoading = false;
    //
    // }
}
