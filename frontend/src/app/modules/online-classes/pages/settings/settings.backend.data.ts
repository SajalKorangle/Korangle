import {SettingsComponent} from './settings.component';

export class SettingsBackendData {

    classList: any;
    divisionList: any;
    activeClassList: any;

    vm: SettingsComponent;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

}
