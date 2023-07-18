import { AttendanceReportComponent } from './attendance-report.component';

export class AttendanceReportServiceAdapter {

    vm: AttendanceReportComponent;

    constructor() { }

    initialize(vm: AttendanceReportComponent): void {
        this.vm = vm;
    }

    async initilizeData() {
        this.vm.stateKeeper.isLoading = true;

        const class_subject_request = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        let sessionList;
        [
            this.vm.backendData.classList, // 0
            this.vm.backendData.divisionList, // 1
            this.vm.backendData.classSubjectList, // 2
            this.vm.backendData.subjectList, // 3
            sessionList, // 4
        ] = await Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 0
            this.vm.classService.getObjectList(this.vm.classService.division, {}), // 1
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_request), // 2
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}), //3
            this.vm.genericService.getObjectList({school_app: 'Session'}, {}), // 4
        ]);
        this.vm.backendData.activeSession = sessionList.find(session => session.id == this.vm.user.activeSchool.currentSessionDbId);
        this.vm.populateInitilizationData();
        this.vm.stateKeeper.isLoading = false;
    }


    async loadAttendance() {
        this.vm.stateKeeper.isLoading = true;
        const endDate = new Date(this.vm.userInput.startDate.getTime());     //endDate denotes startDate only, but with time 11:59 PM
        endDate.setHours(23, 59, 59);
        const student_attendance_request = {
            parentStudentSection__parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentStudentSection__parentClass: this.vm.userInput.selectedClass.id,
            parentStudentSection__parentDivision: this.vm.userInput.selectedDivision.id,
            dateTime__gte: this.vm.userInput.startDate.toJSON(),
            dateTime__lte: endDate.toJSON()
        };

        const student_section_request = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentClass: this.vm.userInput.selectedClass.id,
            parentDivision: this.vm.userInput.selectedDivision.id,
        };

        [
            this.vm.backendData.studentAttendance,
            this.vm.backendData.studentSectionList
        ] = await Promise.all([
            this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.student_attendance, student_attendance_request),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_request),
        ]);
        const student_request = {
            id__in: this.vm.backendData.studentSectionList.map(ss => ss.parentStudent),
        };
        if (this.vm.backendData.studentAttendance.length == 0) {
            this.vm.snackBar.open("No Attendance for selected Date Range", undefined, { duration: 10000 });
        }
        this.vm.backendData.studentList = await this.vm.studentService.getObjectList(this.vm.studentService.student, student_request);
        this.vm.parseStudentData();
        this.vm.stateKeeper.isLoading = false;
    }

}