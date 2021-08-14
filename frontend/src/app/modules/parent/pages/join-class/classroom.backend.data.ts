import { Time } from '@modules/online-classes/class/constants';

import { ClassroomComponent } from './classroom.component';
import { ParsedOnlineClass } from '@modules/online-classes/class/constants';
import { ClassSubject } from '@services/modules/subject/models/class-subject';
import { Subject } from '@services/modules/subject/models/subject';
import { AccountInfo } from '@services/modules/online-class/models/account-info';

export class ClassroomBackendData {

    vm: ClassroomComponent;

    private _onlineClassList: Array<ParsedOnlineClass>;
    classSubjectList: Array<ClassSubject>;
    subjectList: Array<Subject>;
    accountInfoList: Array<AccountInfo>;

    studentAttendanceList: any;

    studentSection: any;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
    }

    get onlineClassList() {
        return this._onlineClassList;
    }

    set onlineClassList(onlineClassListValue) {
        const parsedOnlineClassList: Array<ParsedOnlineClass> = onlineClassListValue.map(onlineClass => {
            Object.setPrototypeOf(onlineClass.startTimeJSON, Time.prototype);
            Object.setPrototypeOf(onlineClass.endTimeJSON, Time.prototype);
            return onlineClass as ParsedOnlineClass;
        });
        parsedOnlineClassList.sort((onlineClass1, onlineClass2) => {    // more preference to lower class and lower section
            const classSubject1 = this.getClassSubjectById(onlineClass1.parentClassSubject);
            const classSubject2 = this.getClassSubjectById(onlineClass2.parentClassSubject);
            return classSubject1.parentClass - classSubject2.parentClass
                || classSubject1.parentDivision - classSubject2.parentDivision
                || onlineClass1.id - onlineClass2.id;
        });
        this._onlineClassList = parsedOnlineClassList;
    }


    getClassSubjectById(id: number) {
        return this.classSubjectList.find(classSubject => classSubject.id == id);
    }

    getSubjectById(id: number) {
        return this.subjectList.find(subject => subject.id == id);
    }

    getAccountInfoByParentEmployee(employeeId: number) {
        return this.accountInfoList.find(accountInfo => accountInfo.parentEmployee == employeeId);
    }

}
