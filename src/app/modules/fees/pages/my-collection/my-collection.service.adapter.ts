
import { MyCollectionComponent } from './my-collection.component';

export class MyCollectionServiceAdapter {

    vm: MyCollectionComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: MyCollectionComponent): void {
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