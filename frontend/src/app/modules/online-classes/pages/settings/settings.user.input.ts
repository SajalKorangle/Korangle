import {SettingsComponent} from './settings.component';

export class SettingsUserInput {

    vm: SettingsComponent;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

}
