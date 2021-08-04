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

    get onlineClassList(): Array<ParsedOnlineClass> {
        return this._onlineClassList;
    }

    set onlineClassList(onlineClassListValue: Array<ParsedOnlineClass>) {
        onlineClassListValue.forEach(onlineClass => {
            Object.setPrototypeOf(onlineClass.startTimeJSON, Time.prototype);
            Object.setPrototypeOf(onlineClass.endTimeJSON, Time.prototype);
        });

        onlineClassListValue.forEach((concernedOnlineClass) => {
            if (!concernedOnlineClass)
                return;
            const bookedSlotOnlineClassIndex = onlineClassListValue.findIndex(onlineClass => {
                if (onlineClass.id == concernedOnlineClass.id) {
                    return false;
                }
                if (concernedOnlineClass.day == onlineClass.day
                    && TimeComparator(concernedOnlineClass.startTimeJSON, onlineClass.endTimeJSON) < 0
                    && TimeComparator(onlineClass.startTimeJSON, concernedOnlineClass.endTimeJSON) < 0) {
                    return true;
                }
            });
            if (bookedSlotOnlineClassIndex != -1) {
                onlineClassListValue.splice(bookedSlotOnlineClassIndex, 1);
            }
        });
        this._onlineClassList = onlineClassListValue;
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
