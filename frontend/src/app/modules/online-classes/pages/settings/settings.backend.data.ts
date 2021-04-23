import {SettingsComponent} from './settings.component';

export class SettingsBackendData {

    vm: SettingsComponent;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

}
