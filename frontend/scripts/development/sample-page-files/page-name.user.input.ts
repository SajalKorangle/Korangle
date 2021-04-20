import {PageNameComponent} from './page-name.component';

export class PageNameUserInput {

    vm: PageNameComponent;

    constructor() { }

    initialize(vm: PageNameComponent): void {
        this.vm = vm;
    }

}
