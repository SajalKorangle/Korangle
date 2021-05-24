import { StudentPermissionComponent } from './student-permission.component';
import { CommonFunctions } from '@classes/common-functions';

export class StudentPermissionServiceAdapter {

    vm: StudentPermissionComponent;

    constructor() { }

    initialize(vm: StudentPermissionComponent): void {
        this.vm = vm;
    }

    async initilizeData() {
        if (CommonFunctions.getActiveSession().id != this.vm.user.activeSchool.currentSessionDbId) {
            this.vm.isActiveSession = false;
            return;
        }
        this.vm.isActiveSession = true;
        this.vm.isLoading = true;

        const request_student_section_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        const restricted_student_request = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        [this.vm.backendData.studentSectionList, this.vm.backendData.classList, this.vm.backendData.divisionList, this.vm.backendData.restrictedStudentList]
            = await Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data), // 0
                this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 1
                this.vm.classService.getObjectList(this.vm.classService.division, {}), // 2
                this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.restricted_students, restricted_student_request), //3
            ]);

        const request_student_data = {
            id__in: this.vm.backendData.studentSectionList.map(ss => ss.parentStudent),
            fields__korangle: ['id', 'name', 'fathersName', 'scholarNumber', 'mobileNumber']
        };

        this.vm.backendData.studentList = await this.vm.studentService.getObjectList(
            this.vm.studentService.student, request_student_data
        );

        this.vm.initilizeHTMLRenderedData();
        this.vm.isLoading = false;
    }

    async updateStudentRestriction() {
        this.vm.isLoading = true;
        const allRestrictedStudentList = this.vm.htmlRenderer.studentSectionList.filter(ss => !ss.selected).map(ss => {
            return { parentStudent: ss.parentStudent.id };
        });

        const toDeleteRestrictionList = this.vm.backendData.restrictedStudentList.filter(restrictedStudent => {
            return !allRestrictedStudentList.find(rs => rs.parentStudent == restrictedStudent.parentStudent);
        }).map(rd => rd.id);
        const deleteRequest = { id__in: toDeleteRestrictionList };

        const toCreateRestrictionList = allRestrictedStudentList.filter(studentRestriction => {
            return !this.vm.backendData.restrictedStudentList.find(rs => rs.parentStudent == studentRestriction.parentStudent);
        });
        // console.log("all: ", allRestrictedStudentList);
        // console.log("create:", toCreateRestrictionList);

        const serviceList = [this.vm.onlineClassService.createObjectList(this.vm.onlineClassService.restricted_students, toCreateRestrictionList)];
        if (toDeleteRestrictionList.length != 0) {
            serviceList.push(this.vm.onlineClassService.deleteObjectList(this.vm.onlineClassService.restricted_students, deleteRequest));
        }

        const [createdResponse,] = await Promise.all(serviceList);

        this.vm.backendData.restrictedStudentList = this.vm.backendData.restrictedStudentList.filter(restrictedStudent => {
            return allRestrictedStudentList.find(rs => rs.parentStudent == restrictedStudent.parentStudent);
        });
        this.vm.backendData.restrictedStudentList.push(...createdResponse);
        this.vm.isLoading = false;
    }

}
