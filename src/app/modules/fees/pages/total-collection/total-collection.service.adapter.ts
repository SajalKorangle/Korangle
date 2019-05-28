
import { TotalCollectionComponent } from './total-collection.component';

export class TotalCollectionServiceAdapter {

    vm: TotalCollectionComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: TotalCollectionComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoading = true;
    }

}