import { ViewListComponent } from './view-list.component';

export class ViewListServiceAdapter {

    vm: ViewListComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: ViewListComponent): void {
        this.vm = vm;
    }

    async initializeData() { }

}
