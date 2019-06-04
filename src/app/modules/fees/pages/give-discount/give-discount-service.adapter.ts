
import { GiveDiscountComponent } from './give-discount.component';

export class GiveDiscountServiceAdapter {

    vm: GiveDiscountComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: GiveDiscountComponent): void {
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