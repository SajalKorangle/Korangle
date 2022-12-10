import {JoinAllComponent} from './join-all.component';
import { CommonFunctions } from '@modules/common/common-functions';


export class JoinAllServiceAdapter {

    vm: JoinAllComponent;

    constructor() { }

    initialize(vm: JoinAllComponent): void {
        this.vm = vm;
    }

    async initializeData() {

        const class_subject_request = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };
        const employee_request = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        const online_class_request = {
            parentClassSubject__parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.isLoading = true;
        const sessionList = await this.vm.genericService.getObjectList({school_app: 'Session'}, {});
        if (CommonFunctions.isSessionActive(this.vm.user.activeSchool.currentSessionDbId, sessionList)) {
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
            this.vm.onlineClassList,
        ] = await Promise.all([
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_request),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
            this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.account_info, {}),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_request),
            this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.online_class, online_class_request),
        ]);

        this.vm.parseBackendData();
        this.vm.isLoading = false;
    }

    async initializeMeetingData(accountInfo) {
        this.vm.isLoading = true;
        const signature_request = {
            meetingNumber: accountInfo.meetingNumber,
            role: 0,
        };
        const response = await this.vm.onlineClassService.getObject(this.vm.onlineClassService.zoom_meeting_signature, signature_request);
        this.vm.isLoading = false;
        this.vm.populateMeetingParametersAndStart(accountInfo, response.signature, response.apiKey);


    }


}
