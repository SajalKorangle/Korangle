
import { GiveParentDiscountComponent } from './give-parent-discount.component';

export class GiveParentDiscountServiceAdapter {

    vm: GiveParentDiscountComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: GiveParentDiscountComponent): void {
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