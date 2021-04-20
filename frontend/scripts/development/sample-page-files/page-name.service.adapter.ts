import {PageNameComponent} from './page-name.component';

export class PageNameServiceAdapter {

    vm: PageNameComponent;

    constructor() { }

    initialize(vm: PageNameComponent): void {
        this.vm = vm;
    }

}
