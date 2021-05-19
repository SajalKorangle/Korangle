import {StudentPermissionComponent} from './student-permission.component';

export class StudentPermissionHtmlRenderer {

    vm: StudentPermissionComponent;

    classDivisionList: Array<any>;

    studentSectionList: Array<any>;

    constructor() { }

    initialize(vm: StudentPermissionComponent): void {
        this.vm = vm;
    }

    selectAllClasses():void {
        this.classDivisionList.forEach(cd=> cd.selected = true);
    }

    unselectAllClasses(): void{
        this.classDivisionList.forEach(cd=> cd.selected = false);
    }

    getFilteredStudentSectionList(): Array<any>{
        return this.studentSectionList.filter(ss=>{
            return this.classDivisionList.find(cd=> cd.selected && cd.class.id==ss.parentClass && cd.section.id == ss.parentDivision);
        });
    }

}
