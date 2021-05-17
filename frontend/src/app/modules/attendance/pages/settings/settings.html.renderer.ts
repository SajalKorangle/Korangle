import {SettingsComponent} from '@modules/attendance/pages/settings/settings.component';

export class SettingsHtmlRenderer {

    vm: SettingsComponent;

    constructor() {
    }

    initializeAdapter(vm: SettingsComponent): void {
        this.vm = vm;
    }
}

