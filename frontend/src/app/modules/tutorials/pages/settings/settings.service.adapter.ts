import { SettingsComponent } from './settings.component';

export class SettingsServiceAdapter {
    vm: SettingsComponent;

    constructor() {}

    initializeAdapter(vm: SettingsComponent): void {
        this.vm = vm;
    }

}
