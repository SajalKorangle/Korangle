import {AddTutorialComponent} from '@modules/tutorials/pages/add-tutorial/add-tutorial.component';

export class AddTutorialBackendData {

    vm: AddTutorialComponent;

    classList: any;
    sectionList: any;
    classSubjectList: any;
    subjectList: any;
    fullStudentList: any;
    
    constructor() {
    }


    initializeAdapter(vm: AddTutorialComponent): void {
        this.vm = vm;
    }
    
}