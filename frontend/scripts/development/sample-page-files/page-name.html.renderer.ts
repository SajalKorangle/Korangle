import {PageNameComponent} from './page-name.component';

export class PageNameHtmlRenderer {

    vm: PageNameComponent;

    constructor() { }

    initialize(vm: PageNameComponent): void {
        this.vm = vm;
    }

}
