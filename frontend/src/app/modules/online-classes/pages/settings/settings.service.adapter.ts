import { SettingsComponent } from './settings.component';

export class SettingsServiceAdapter {

    vm: SettingsComponent;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

    async initializeData() {

        this.vm.isLoading = true;

        const online_class_list_request = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentClassSubject__parentSession: this.vm.user.activeSchool.currentSessiondbId
        };

        const class_subject_list_request = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessiondbId
        };

        const employee_list_request = {
            parentSchool: this.vm.user.activeSchool.dbId,
            fields__korangle: ['id', 'name'],
        };

        [
            this.vm.backendData.classList,
            this.vm.backendData.divisionList,
            this.vm.backendData.onlineClassList,
            this.vm.backendData.classSubjectList,
            this.vm.backendData.subjectList,
            this.vm.backendData.employeeList,
            this.vm.backendData.accountInfoList,
        ] = await Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 0
            this.vm.classService.getObjectList(this.vm.classService.division, {}), // 1
            this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.online_class, online_class_list_request), // 2
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_list_request), // 3
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}), //4
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_list_request), //5
            this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.account_info, {}), // 6
        ]);

        this.vm.parseMeetingConfiguration();
        this.vm.isLoading = false;

    }

}
