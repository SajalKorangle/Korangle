import { ClassroomComponent } from './classroom.component';
import { CommonFunctions } from '@modules/common/common-functions';

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

        const restricted_student_request = {
            parentStudent: this.vm.activeStudent.id,
        };

        [
            this.vm.backendData.studentSection,
            this.vm.restrictedStudent
        ] = await Promise.all([
            this.vm.studentService.getObject(this.vm.studentService.student_section, student_section_request),  // 1
            this.vm.onlineClassService.getObject(this.vm.onlineClassService.restricted_students, restricted_student_request), // 2
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

    async markAttendance() {
        const today = new Date();
        const student_attendance_request = {
            parentStudentSection: this.vm.backendData.studentSection.id,
            parentClassSubject: this.vm.htmlRenderer.getActiveClass().parentClassSubject,
            dateTime__day: today.getUTCDate(),
            dateTime__month: today.getUTCMonth() + 1,
            dateTime__year: today.getUTCFullYear(),
        };
        this.vm.backendData.studentAttendance = await this.vm.onlineClassService.getObject(this.vm.onlineClassService.student_attendance, student_attendance_request);
        if (this.vm.backendData.studentAttendance) {
            // const currentTime = new Date();
            // const startTime = new Date(this.vm.backendData.studentAttendance.dateTime);
            // this.vm.studentAttendanceDownTime = (currentTime.getTime() - startTime.getTime()) / 1000 - this.vm.backendData.studentAttendance.duration;
            return;
        }
        const studentAttendance = {
            parentStudentSection: this.vm.backendData.studentSection.id,
            parentClassSubject: this.vm.htmlRenderer.getActiveClass().parentClassSubject,
            duration: 0
        };
        this.vm.backendData.studentAttendance = await this.vm.onlineClassService.createObject(this.vm.onlineClassService.student_attendance, studentAttendance);
    }

    // updateAttendance = async () => {
    //     const currentTime = new Date();
    //     const startTime = new Date(this.vm.backendData.studentAttendance.dateTime);
    //     const duration = ((currentTime.getTime() - startTime.getTime()) / (1000)) - this.vm.studentAttendanceDownTime; // in seconds
    //     this.vm.backendData.studentAttendance.duration = Math.ceil(duration);
    //     await this.vm.onlineClassService.updateObject(this.vm.onlineClassService.student_attendance, this.vm.backendData.studentAttendance);
    // };

}
