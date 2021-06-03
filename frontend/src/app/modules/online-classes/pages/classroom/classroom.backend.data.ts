import { ClassroomComponent } from './classroom.component';
import { ParsedOnlineClass } from '@modules/online-classes/class/constants';
import { AccountInfo } from '@services/modules/online-class/models/account-info';
import { ClassSubject } from '@services/modules/subject/models/class-subject';
import { Subject } from '@services/modules/subject/models/subject';

export class ClassroomBackendData {

    vm: ClassroomComponent;

    onlineClassList: Array<ParsedOnlineClass>;
    accountInfo: AccountInfo;
    classSubjectList: Array<ClassSubject>;
    subjectList: Array<Subject>;

    classList: Array<any>;
    divisionList: Array<any>;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
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
