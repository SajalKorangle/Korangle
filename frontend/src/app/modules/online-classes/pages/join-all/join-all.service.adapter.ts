import {JoinAllComponent} from './join-all.component';
import { CommonFunctions } from '@modules/common/common-functions';


export class JoinAllServiceAdapter {

    vm: JoinAllComponent;

    constructor() { }

    initialize(vm: JoinAllComponent): void {
        this.vm = vm;
    }

    async initializeData(){

        const class_subject_request = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };
        const employee_request={
            parentSchool:this.vm.user.activeSchool.dbId,
            // parentSession:this.vm.user.activeSchool.currentSessionDbId,
        }

        // const account_info_request = {
        //     parentEmployee: this.vm.user.activeSchool.employeeId,
        // };

        this.vm.isLoading = true;
        if (this.vm.user.activeSchool.currentSessionDbId != CommonFunctions.getActiveSession().id) {
            this.vm.isActiveSession = false;
            this.vm.isLoading = false;
            return;
        }
        this.vm.isActiveSession = true;

        [
            this.vm.classSubjectList,
            this.vm.classList,
            this.vm.divisionList,
            this.vm.subjectList,
            this.vm.accountInfoList,
            this.vm.employeeList,
        ] = await Promise.all([
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_request),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
            this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.account_info, {}),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees,employee_request),
        ]);
        const online_class_request = {
            parentClassSubject__parentSession: this.vm.user.activeSchool.currentSessionDbId,
            // parentClassSubject__in: this.vm.classSubjectList.map(classSubject => classSubject.id),
        };
        this.vm.onlineClassList=await this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.online_class, online_class_request);
        this.vm.parseBackendData();
        this.vm.isLoading=false;
    }

}
