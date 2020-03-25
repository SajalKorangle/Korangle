
import {SetRollnumberComponent} from './set-rollnumber.component';

export class SetRollnumberServiceAdapter {

    vm: SetRollnumberComponent;

    constructor() {}

    // Data
    classList: any;
    sectionList: any;
    studentSectionList: any;

    initializeAdapter(vm: SetRollnumberComponent): void {
        this.vm = vm;
    }

    initializeData(): void {

    }

}
