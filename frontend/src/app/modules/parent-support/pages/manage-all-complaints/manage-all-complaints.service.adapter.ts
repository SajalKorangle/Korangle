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

        let studentList = [];
        let studentSectionList = [];
        [
            this.vm.complaintList,   // 0
            studentList,   // 1
            studentSectionList,   // 2
        ] = await Promise.all([
            complaintQuery,   // 0
            studentQuery,   // 1
            studentSectionQuery,   // 2
        ]);

        console.log("Complaint List: ", this.vm.complaintList);
        this.vm.initializeStudentFullProfileList(studentList, studentSectionList);
        this.vm.isLoading = false;
    }  // Ends: initializeData()
}
