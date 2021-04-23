import {SettingsComponent} from './settings.component';

export class SettingsHtmlRenderer {

    vm: SettingsComponent;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

}
