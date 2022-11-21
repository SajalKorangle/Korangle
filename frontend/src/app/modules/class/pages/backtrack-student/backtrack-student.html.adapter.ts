import { BacktrackStudentComponent } from "./backtrack-student.component";

export class BacktrackStudentHtmlAdapter {

    vm: BacktrackStudentComponent;

    selectedClassSectionList: {
        class: {
            id: number,
            name: string,
            orderNumber: number
        },
        section: {
            id: number,
            name: string,
            orderNumber: number
        }
    }[] = [];

    constructor() {}

    initialize(vm: BacktrackStudentComponent) { this.vm = vm; } 

    // START: select all the class-sections
    selectAllClassSectionHandler() {
        this.selectedClassSectionList = [];
        this.selectedClassSectionList = this.vm.classSectionList;
    }
    // END: select all the class-sections

    // START: deselect all the class-sections
    clearAllClassSectionHandler() {
        this.selectedClassSectionList = [];
    }
    // END: deselect all the class-sections

}