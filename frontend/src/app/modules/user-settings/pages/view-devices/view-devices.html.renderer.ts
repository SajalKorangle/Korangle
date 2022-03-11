import { ViewDevicesComponent } from './view-devices.component';

export class ViewDevicesHtmlRenderer {
    vm: ViewDevicesComponent;

    constructor() {}

    initializeRenderer(vm: ViewDevicesComponent): void {
        this.vm = vm;
    }
}
