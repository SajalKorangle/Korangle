import { BlockStudentComponent } from './block-student.component';
import { CommonFunctions } from '@modules/common/common-functions';
import {getValidStudentSectionList} from '@modules/classes/valid-student-section-service';

export class BlockStudentServiceAdapter {

    vm: BlockStudentComponent;

    constructor() { }

    initialize(vm: BlockStudentComponent): void {
        this.vm = vm;
    }

    async initilizeData() {

        this.vm.isLoading = true;

        const sessionList = await this.vm.genericService.getObjectList({school_app: 'Session'}, {});
        if (CommonFunctions.isSessionActive(this.vm.user.activeSchool.currentSessionDbId, sessionList)) {
            this.vm.isActiveSession = false;
            this.vm.isLoading = true;
            return;
        }

        this.vm.isActiveSession = true;

        const request_student_section_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentStudent__parentTransferCertificate: 'null__korangle'
        };

        const restricted_student_request = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        const value = await Promise.all([
                getValidStudentSectionList(this.vm.tcService, this.vm.studentService, request_student_section_data), // 0
                this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 1
                this.vm.classService.getObjectList(this.vm.classService.division, {}), // 2
                this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.restricted_students, restricted_student_request), //3
            ]);

        this.vm.backendData.studentSectionList = value[0];
        this.vm.backendData.classList = value[1];
        this.vm.backendData.divisionList = value[2];
        this.vm.backendData.restrictedStudentList = value[3];

        let request_student_data = {
            id__in: [],
            fields__korangle: ['id', 'name', 'fathersName', 'scholarNumber', 'mobileNumber']
        };

        const student_data_service_list = [];
        let student_id_chunk = [];
        this.vm.backendData.studentSectionList.forEach(ss => {
            student_id_chunk.push(ss.parentStudent);
            if (student_id_chunk.join(',').length > 900) {
                request_student_data = { ...request_student_data, id__in: [...student_id_chunk] };
                student_data_service_list.push(this.vm.studentService.getObjectList(
                    this.vm.studentService.student, request_student_data
                ));
                student_id_chunk = [];
            }
        });
        if (student_id_chunk.join(',').length > 0) {
            request_student_data = { ...request_student_data, id__in: [...student_id_chunk] };
            student_data_service_list.push(this.vm.studentService.getObjectList(
                this.vm.studentService.student, request_student_data
            ));
        }

        this.vm.backendData.studentList = (await Promise.all(student_data_service_list))
            .reduce((acc, studentChunk) => [...acc, ...studentChunk], []);

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

        const [createdResponse, ] = await Promise.all(serviceList);

        this.vm.backendData.restrictedStudentList = this.vm.backendData.restrictedStudentList.filter(restrictedStudent => {
            return allRestrictedStudentList.find(rs => rs.parentStudent == restrictedStudent.parentStudent);
        });
        this.vm.backendData.restrictedStudentList.push(...createdResponse);
        this.vm.isLoading = false;
    }

}
