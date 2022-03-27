import { AddComplaintComponent } from './add-complaint.component';
import { Query } from '@services/generic/query';

export class AddComplaintServiceAdapter {
    vm: AddComplaintComponent;

    constructor() { }

    /* Initialize Adapter */
    initializeAdapter(vm: AddComplaintComponent): void {
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

        const complaintTypeQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ complaints_app: 'SchoolComplaintType' });

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

    async assignEmployeeComplaint(employeeComplaintList) {
        const response = await new Query().createObjectList({complaints_app: 'EmployeeComplaint'}, employeeComplaintList);
    }

    /* Add Complaint */
    async addComplaint() {
        this.vm.isLoading = true;

        /* Starts: Prepare Complaint Object */
        let complaintObject = {};
        complaintObject["parentEmployee"] = this.vm.user.activeSchool.employeeId;

        if (this.vm.complaintType["id"]) {
            complaintObject["parentSchoolComplaintType"] = this.vm.complaintType.id;
            complaintObject["parentSchoolComplaintStatus"] = this.vm.complaintType.parentSchoolComplaintStatusDefault;
        } else {
            complaintObject["parentSchoolComplaintType"] = this.vm.NULL_CONSTANT;
            complaintObject["parentSchoolComplaintStatus"] = this.vm.NULL_CONSTANT;
        }

        complaintObject["parentStudent"] = this.vm.selectedStudent.dbId;
        complaintObject["title"] = this.vm.complaintTitle;
        complaintObject["parentSchool"] = this.vm.user.activeSchool.dbId;
        /* Ends: Prepare Complaint Object */

        /* Starts: Add it to database */
        const complaint = await new Query().createObject({complaints_app: 'Complaint'}, complaintObject);
        /* Ends: Add it to database */

        /* Starts: Create && Add Comment Object */
        if (this.vm.comment) {
            let commentObject = {};
            commentObject["parentEmployee"] = this.vm.NULL_CONSTANT;
            commentObject["parentStudent"] = this.vm.selectedStudent.dbId;
            commentObject["message"] = this.vm.comment;
            commentObject["parentComplaint"] = complaint.id;

            const comment = await new Query().createObject({complaints_app: 'Comment'}, commentObject);
        }
        /* Ends: Create && Add Comment Object */

        /* Starts: Initialize Data */
        this.vm.comment = "";
        this.vm.initializeComplaintData();
        alert("Complaint added successfully.");
        this.vm.isLoading = false;
        /* Ends: Initialize Data */

    }  // Ends: addComplaint()
}
