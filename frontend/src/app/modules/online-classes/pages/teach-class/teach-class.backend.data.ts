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
        onlineClassListValue.sort((a, b) => b.id - a.id);
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
