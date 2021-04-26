import { SettingsComponent } from './settings.component';

export class SettingsBackendData {

    classList: any;
    divisionList: any;
    onlineClassList: any;

    vm: SettingsComponent;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

}

interface ZoomAuthData {
    email: string;
    jwt: string;
}
