
import { LockFeesComponent } from './lock-fees.component';

export class LockFeesServiceAdapter {

    vm: LockFeesComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: LockFeesComponent): void {
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