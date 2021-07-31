import { DesignLayoutComponent } from './design-layout.component';

export class DesignLayoutHtmlRenderer {
    vm: DesignLayoutComponent;

    isLoading: boolean = true;

    constructor(vm: DesignLayoutComponent) {
        this.vm = vm;
    }
}