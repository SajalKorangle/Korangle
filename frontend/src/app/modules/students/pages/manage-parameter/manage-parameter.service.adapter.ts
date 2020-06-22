
import { ManageParameterComponent } from './manage-parameter.component';

export class ManageParameterServiceAdapter {

    vm: ManageParameterComponent;

    constructor() {}

    initializeAdapter(vm: ManageParameterComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {

        // this.vm.isLoading = true;

    }

}
