import {AddTutorialComponent} from '@modules/tutorials/pages/add-tutorial/add-tutorial.component';

export class AddTutorialUserInput {

    vm: AddTutorialComponent;

    newTutorial: any;
    selectedSection: any;
    editedTutorial: any;
    selectedClass: any;
    selectedSubject = null;
    

    constructor() {
    }

    initializeAdapter(vm: AddTutorialComponent): void {
        this.vm = vm;
    }

    initializeNewTutorial(): void {
        this.newTutorial = {
            id: null,
            parentClassSubject: this.vm.getParentClassSubject(),
            chapter: null,
            topic: null,
            link: null,
            editable: false,
            orderNumber: 0,
        };
    }

}