import { TeachClassComponent } from './teach-class.component';

import { TimeComparator, Time } from '@modules/online-classes/class/constants';

// for types
import { ParsedOnlineClass } from '@modules/online-classes/class/constants';
import { AccountInfo } from '@services/modules/online-class/models/account-info';
import { ClassSubject } from '@services/modules/subject/models/class-subject';
import { Subject } from '@services/modules/subject/models/subject';

export class TeachClassBackendData {

    vm: TeachClassComponent;

    private _onlineClassList: Array<ParsedOnlineClass>;
    accountInfo: AccountInfo;
    classSubjectList: Array<ClassSubject>;
    subjectList: Array<Subject>;

    classList: Array<any>;
    divisionList: Array<any>;

    constructor() { }

    initialize(vm: TeachClassComponent): void {
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

    getClassById(classId: number) {
        return this.classList.find(c => c.id == classId);
    }

    getDivisionById(divisionId: number) {
        return this.divisionList.find(d => d.id == divisionId);
    }

    getClassSubjectById(id: number) {
        return this.classSubjectList.find(classSubject => classSubject.id == id);
    }

    getSubjectById(id: number) {
        return this.subjectList.find(subject => subject.id == id);
    }

}
