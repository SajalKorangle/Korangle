
import { GiveStudentDiscountComponent } from './give-student-discount.component';

export class GiveStudentDiscountServiceAdapter {

    vm: GiveStudentDiscountComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: GiveStudentDiscountComponent): void {
        this.vm = vm;
    }

    copyObject(object: any): any {
        let tempObject = {};
        Object.keys(object).forEach(key => {
            tempObject[key] = object[key];
        });
        return tempObject;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoading = true;
    }

}