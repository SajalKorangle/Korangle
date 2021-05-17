import {SettingsComponent} from '@modules/homework/pages/settings/settings.component';

export class SettingsHtmlRenderer {

    vm: SettingsComponent;

    constructor() {
    }

    initializeAdapter(vm: SettingsComponent): void {
        this.vm = vm;
    }
}

