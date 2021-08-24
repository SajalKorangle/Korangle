import { SettingsComponent } from './settings.component';
import { Time } from '@modules/online-classes/class/constants';

// for types
import { Classs } from '@services/modules/class/models/classs';
import { Division } from '@services/modules/class/models/division';
import { AccountInfo } from '@services/modules/online-class/models/account-info';
import { ClassSubject } from '@services/modules/subject/models/class-subject';
import { Subject } from '@services/modules/subject/models/subject';
import { ParsedOnlineClass } from '@modules/online-classes/class/constants';


export class SettingsBackendData {

    classList: Array<Classs>;
    divisionList: Array<Division>;

    accountInfoList: Array<AccountInfo>;
    private _onlineClassList: Array<ParsedOnlineClass>;
    classSubjectList: Array<ClassSubject>;
    subjectList: Array<Subject>;

    employeeList: Array<any>;
    employeePermission: any;

    vm: SettingsComponent;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

    get onlineClassList() {
        return this._onlineClassList;
    }

    set onlineClassList(onlineClassList) {
        const parsedOnlineClassList: Array<ParsedOnlineClass> = onlineClassList.map(onlineClass => {
            Object.setPrototypeOf(onlineClass.startTimeJSON, Time.prototype);
            Object.setPrototypeOf(onlineClass.endTimeJSON, Time.prototype);
            return onlineClass as ParsedOnlineClass;
        });
        this._onlineClassList = parsedOnlineClassList;
    }

    getClassById(classId: number) {
        return this.classList.find(c => c.id == classId);
    }

    getDivisionById(divisionId: number) {
        return this.divisionList.find(d => d.id == divisionId);
    }

    getClassSubjectById(id: number): ClassSubject {
        return this.classSubjectList.find(classSubject => classSubject.id == id);
    }

    getSubjectById(id: number) {
        return this.subjectList.find(subject => subject.id == id);
    }

    getEmployeeById(id: number) {
        return this.employeeList.find(employee => employee.id == id);
    }

    getAccountInfoByParentEmployee(employeeId: number) {
        return this.accountInfoList.find(accountInfo => accountInfo.parentEmployee == employeeId);
    }

}
