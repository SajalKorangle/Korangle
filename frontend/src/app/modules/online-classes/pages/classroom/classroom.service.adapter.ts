import { ClassroomComponent } from './classroom.component';

export class ClassroomServiceAdapter {

    vm: ClassroomComponent;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
    }

    async initializeData() {
        this.vm.isLoading = true;

        const currentSession = (await this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}))
            .find(s => s.id == this.vm.user.activeSchool.currentSessionDbId);

        const startDate = new Date(currentSession.startDate);
        const endDate = new Date(currentSession.endDate);
        const today = new Date();
        if (!(today > startDate && today < endDate)) {
            this.vm.isActiveSession = false;
            this.vm.isLoading = false;
            return;
        }
        this.vm.isActiveSession = true;

        const class_subject_request = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        [
            this.vm.backendData.classSubjectList,
            this.vm.backendData.classList,
            this.vm.backendData.divisionList,
            this.vm.backendData.subjectList,
            this.vm.backendData.accountInfoList,
        ] = await Promise.all([
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_request),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
            this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.account_info, {}),
        ]);

        const online_class_request = {
            parentClassSubject__parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentClassSubject__in: this.vm.backendData.classSubjectList.map(classSubject => classSubject.id),
            day: this.vm.today,
        };

        this.vm.backendData.onlineClassList = await this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.online_class, online_class_request);

        this.vm.parseBacknedData();
        this.vm.htmlRenderer.initilizeTimeTable();
        this.vm.isLoading = false;
    }

}
