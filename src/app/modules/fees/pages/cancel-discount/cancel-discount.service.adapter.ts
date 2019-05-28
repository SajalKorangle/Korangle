
import { CancelDiscountComponent } from './cancel-discount.component';

export class CancelDiscountServiceAdapter {

    vm: CancelDiscountComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: CancelDiscountComponent): void {
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