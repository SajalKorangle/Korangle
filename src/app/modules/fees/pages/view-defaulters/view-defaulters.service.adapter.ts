
import { ViewDefaultersComponent } from './view-defaulters.component';

export class ViewDefaultersServiceAdapter {

    vm: ViewDefaultersComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: ViewDefaultersComponent): void {
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