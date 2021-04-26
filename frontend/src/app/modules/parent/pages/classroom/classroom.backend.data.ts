import { AnyAaaaRecord } from 'dns';
import { ClassroomComponent } from './classroom.component';

export class ClassroomBackendData {

    vm: ClassroomComponent;

    onlineClass: AnyAaaaRecord;

    studentSection: any;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
    }

}
