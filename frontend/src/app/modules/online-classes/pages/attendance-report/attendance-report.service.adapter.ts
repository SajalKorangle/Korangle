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

        [
            this.vm.backendData.classList,
            this.vm.backendData.divisionList,
            this.vm.backendData.classSubjectList,
            this.vm.backendData.subjectList,
        ] = await Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 0
            this.vm.classService.getObjectList(this.vm.classService.division, {}), // 1
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_request), // 2
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}), //3
        ]);
        this.vm.populateInitilizationData();
        this.vm.stateKeeper.isLoading = false;
    }

}
