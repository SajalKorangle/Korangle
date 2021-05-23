import { SettingsComponent } from './settings.component';

export class SettingsBackendData {

    classList: any;
    divisionList: any;

    onlineClassList: any;
    classSubjectList: any;
    subjectList: any;

    employeeList: any;

    vm: SettingsComponent;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

    getClassSubjectById(id: number) {
        return this.classSubjectList.find(classSubject => classSubject.id == id);
    }

    getSubjectById(id: number) {
        return this.subjectList.find(subject => subject.id == id);
    }

    getEmployeeById(id: number) {
        return this.employeeList.find(employee => employee.id == id);
    }

}
