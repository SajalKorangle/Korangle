import {ViewListComponent} from './view-list.component';

export class ViewListHtmlRenderer {

    vm: ViewListComponent;

    constructor() {
    }

    initializeAdapter(vm: ViewListComponent): void {
        this.vm = vm;
    }

}