import { BlockStudentComponent } from './block-student.component';

export class BlockStudentBackendData {

    vm: BlockStudentComponent;

    classList: Array<any>;
    divisionList: Array<any>;

    studentList: Array<any>;
    studentSectionList: Array<any>;

    restrictedStudentList: Array<any>;

    constructor() { }

    initialize(vm: BlockStudentComponent): void {
        this.vm = vm;
    }

    getClass(id: number) {
        return this.classList.find(c => c.id == id);
    }

    getDivision(id: number) {
        return this.divisionList.find(d => d.id == id);
    }

}
