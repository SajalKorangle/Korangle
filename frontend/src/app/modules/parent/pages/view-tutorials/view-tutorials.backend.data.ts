import {ViewTutorialsComponent} from '@modules/parent/pages/view-tutorials/view-tutorials.component';


export class ViewTutorialsBackendData {

    vm: ViewTutorialsComponent;
    
    // Data
    examinationList: any;
    studentSubjectList: any;
    classTestList: any;
    studentTestList: any;
    studentProfile: any;
    tutorialList: any;
    classSubjectList = [];
    subjectList = [];


    constructor() {
    }


    initializeAdapter(vm: ViewTutorialsComponent): void {
        this.vm = vm;
    }

}