import {PageNameComponent} from './page-name.component';

export class PageNameBackendData {

    vm: PageNameComponent;

    constructor() { }

    initialize(vm: PageNameComponent): void {
        this.vm = vm;
    }

}
