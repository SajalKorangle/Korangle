import { ClassroomComponent } from './classroom.component';

export class ClassroomBackendData {

    vm: ClassroomComponent;

    onlineClassList: Array<any> = [];

    classDivisionPermissions: Array<{ parentClass: number, parentDivision: number; }> = [];

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

}
