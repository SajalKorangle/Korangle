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

        if (this.vm.user.activeSchool.currentSessionDbId != CommonFunctions.getActiveSession().id) {
            this.vm.isActiveSession = false;
            this.vm.isLoading = false;
            return;
        }
        this.vm.isActiveSession = true;

        const class_subject_request = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        const account_info_request = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
        };


        [
            this.vm.backendData.classSubjectList,
            this.vm.backendData.classList,
            this.vm.backendData.divisionList,
            this.vm.backendData.subjectList,
            this.vm.backendData.accountInfo,
        ] = await Promise.all([
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_request),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
            this.vm.onlineClassService.getObject(this.vm.onlineClassService.account_info, account_info_request),
        ]);

        const online_class_request = {
            parentClassSubject__parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentClassSubject__in: this.vm.backendData.classSubjectList.map(classSubject => classSubject.id),
        };

        this.vm.backendData.onlineClassList = await this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.online_class, online_class_request);

        this.vm.parseBacknedData();
        this.vm.htmlRenderer.initilizeTimeTable();
        this.vm.isLoading = false;
    }

}
