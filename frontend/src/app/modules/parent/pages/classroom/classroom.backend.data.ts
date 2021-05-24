import { ClassroomComponent } from './classroom.component';
import { ParsedOnlineClass } from '@modules/online-classes/class/constants';
import { ClassSubject } from '@services/modules/subject/models/class-subject';
import { Subject } from '@services/modules/subject/models/subject';

export class ClassroomBackendData {

    vm: ClassroomComponent;

    onlineClassList: Array<ParsedOnlineClass>;
    classSubjectList: Array<ClassSubject>;
    subjectList: Array<Subject>;

    studentSection: any;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
    }

    getClassSubjectById(id: number) {
        return this.classSubjectList.find(classSubject => classSubject.id == id);
    }

    getSubjectById(id: number) {
        return this.subjectList.find(subject => subject.id == id);
    }

}
