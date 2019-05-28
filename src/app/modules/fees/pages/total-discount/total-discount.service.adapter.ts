
import { TotalDiscountComponent } from './total-discount.component';

export class TotalDiscountServiceAdapter {

    vm: TotalDiscountComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: TotalDiscountComponent): void {
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