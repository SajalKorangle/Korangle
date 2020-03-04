
import {ManageLayoutComponent} from './manage-layout.component';

export class ManageLayoutServiceAdapter {

    vm: ManageLayoutComponent;

    constructor() {}

    // Data
    classList: any;
    sectionList: any;


    initializeAdapter(vm: ManageLayoutComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {

        
    }


}