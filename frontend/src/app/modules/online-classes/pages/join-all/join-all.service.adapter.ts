import {JoinAllComponent} from './join-all.component';

export class JoinAllServiceAdapter {

    vm: JoinAllComponent;

    constructor() { }

    initialize(vm: JoinAllComponent): void {
        this.vm = vm;
    }

    async initializeData(){

        // const class_subject_request = {
        //     parentEmployee: this.vm.user.activeSchool.employeeId,
        //     parentSession: this.vm.user.activeSchool.currentSessionDbId,
        // };

        const account_info_request = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
        };

        this.vm.isLoading = true;

        [
            this.vm.classSubjectList,
            this.vm.classList,
            this.vm.divisionList,
            this.vm.subjectList,
            this.vm.accountInfo,
        ] = await Promise.all([
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, {}),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
            this.vm.onlineClassService.getObject(this.vm.onlineClassService.account_info, {}),
        ]);
        // const online_class_request = {
        //     parentClassSubject__parentSession: this.vm.user.activeSchool.currentSessionDbId,
        //     parentClassSubject__in: this.vm.classSubjectList.map(classSubject => classSubject.id),
        // };
        this.vm.onlineClassList=await this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.online_class, {});
        this.vm.isLoading=false;
    }

}
