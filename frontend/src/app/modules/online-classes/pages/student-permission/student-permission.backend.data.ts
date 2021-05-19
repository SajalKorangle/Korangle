import {StudentPermissionComponent} from './student-permission.component';

export class StudentPermissionBackendData {

    vm: StudentPermissionComponent;

    classList: Array<any>;
    divisionList: Array<any>;

    studentList: Array<any>;
    studentSectionList: Array<any>;

    constructor() { }

    initialize(vm: StudentPermissionComponent): void {
        this.vm = vm;
    }

    getClass(id:number) {
        return this.classList.find(c=> c.id==id);
    }

    getDivision(id: number){
        return this.divisionList.find(d=> d.id==id);   
    }

}
