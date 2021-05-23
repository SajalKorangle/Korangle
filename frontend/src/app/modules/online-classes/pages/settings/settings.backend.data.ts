import { SettingsComponent } from './settings.component';
import { Classs } from '@services/modules/class/models/classs';
import { Division } from '@services/modules/class/models/division';
import { AccountInfo } from '@services/modules/online-class/models/account-info';
import { OnlineClass } from '@services/modules/online-class/models/online-class';
import { ClassSubject } from '@services/modules/subject/models/class-subject';
import { Subject } from '@services/modules/subject/models/subject';

export class SettingsBackendData {

    classList: Array<Classs>;
    divisionList: Array<Division>;

    accountInfoList: Array<AccountInfo>;
    onlineClassList: Array<OnlineClass>;
    classSubjectList: Array<ClassSubject>;
    subjectList: Array<Subject>;

    employeeList: Array<any>;

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
