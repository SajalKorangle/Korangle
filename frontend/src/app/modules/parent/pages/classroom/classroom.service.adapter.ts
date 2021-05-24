import { ClassroomComponent } from './classroom.component';
import { CommonFunctions } from '@classes/common-functions';

export class ClassroomServiceAdapter {

    vm: ClassroomComponent;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
    }

    async initializeData() {
        this.vm.isLoading = true;

        const student_section_request = {
            parentStudent: this.vm.activeStudent.id,
            parentSession: this.vm.user.activeSchool.currentSessionDbId
        };

        [
            this.vm.backendData.studentSection
        ] = await Promise.all([
            this.vm.studentService.getObject(this.vm.studentService.student_section, student_section_request),  // 1
        ]);


        if (CommonFunctions.getActiveSession().id == this.vm.user.activeSchool.currentSessionDbId) { // only if in current session
            this.vm.isActiveSession = true;

            const class_subject_request = {
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
                parentClass: this.vm.backendData.studentSection.parentClass,
                parentDivision: this.vm.backendData.studentSection.parentDivision,
            };

            const online_class_request = {
                parentClassSubject__parentSession: this.vm.user.activeSchool.currentSessionDbId,
                parentClassSubject__parentClass: this.vm.backendData.studentSection.parentClass,
                parentClassSubject__parentDivision: this.vm.backendData.studentSection.parentDivision,
            };
            [
                this.vm.backendData.onlineClassList,
                this.vm.backendData.classSubjectList,
                this.vm.backendData.subjectList
            ] = await Promise.all([
                this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.online_class, online_class_request),
                this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_request),
                this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
            ]);
            this.vm.parseBacknedData();
            this.vm.htmlRenderer.initilizeTimeTable();
        }
        else {
            this.vm.isActiveSession = false;
        }

        this.vm.isLoading = false;
    }

    async initilizeMeetingData(onlineClass) {
        this.vm.isLoading = true;
        const signature_request = {
            meetingNumber: onlineClass.meetingNumber,
            role: 0,
        };
        const response = await this.vm.onlineClassService.getObject(this.vm.onlineClassService.zoom_meeting_signature, signature_request);

        this.vm.populateMeetingParametersAndStart(onlineClass, response.signature, response.apiKey);

        this.vm.isLoading = false;
    }

}
