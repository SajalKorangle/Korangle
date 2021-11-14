import { DesignLayoutComponent } from './design-layout.component';

export class DesignLayoutServiceAdapter {
    vm: DesignLayoutComponent;

    constructor(vm: DesignLayoutComponent) {
        this.vm = vm;
    }

    async initializeDate() {
        this.vm.isLoading = false;
    }
}